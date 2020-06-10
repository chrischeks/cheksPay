import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as uni from '../../../globals/universal'
import { SeedService } from '../../../providers/seed.service';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  isLoading: boolean = false;
  bankSelect = new Array();
  beneficiary: string = '';
  bu = JSON.parse(localStorage.BaseUser);
  constructor(
    private seedService: SeedService,
    private router: Router,
    private cp: CurrencyPipe
  ) { }

  ngOnInit() {
    this.initForm();
    this.banks();
  }
  initForm() {
    this.transferForm = new FormGroup({
      account_bank: new FormControl('', Validators.required),
      account_number: new FormControl("", [Validators.maxLength(10), Validators.minLength(10), Validators.required]),
      amount: new FormControl("", Validators.required),
      narration: new FormControl(""),
      currency: new FormControl("NGN"),
      // beneficiary: new FormControl("")
    })
  }
  onSubmit() {
    swal.fire({
      title: 'TRANSFER',
      text: 'Transfer in progress, please wait...',
      timer: 60000,
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    const model = {
      x: this.bu._id,
      scheme: uni.scheme
    }
    this.seedService.getUserByUserId(model).then(resp => {
// transfer ref: HE21E4
      if (resp[0]._id) {
        let walletCheck = uni.preparePurchase(resp[0].wallet, (this.transferForm.value.amount * 100));
        if (walletCheck.canProceed) {
          this.seedService.doFWTransfer(this.transferForm.value).then(res => {
            if (res.data.transfers[0].status == "SUCCESS" || res.data.transfers[0].status == "PENDING") {
              let user = resp[0]
              let adminInfo: any = {
                _id: "self",
              }
              let beneficiaryInfo: any = {
                _id: user._id,
                account_number: res.data.transfers[0].account_number,
                fullname: res.data.transfers[0].fullname,
                bank_code: res.data.transfers[0].bank_code
              }
              if (!this.transferForm.value.narration) {
                this.transferForm.value.narration = "Wallet transfer to " + `${beneficiaryInfo.fullname}(${beneficiaryInfo.account_number})`
              }
              console.log(res.data.transfers[0], 'rrrrrrr');
              
              user["transaction"] = {
                scheme: uni.scheme,
                amount: this.transferForm.value.amount * 100,
                transferType: "transfer",
                transferProvider: "RubikPay",
                transferChannel: "web",
                transactionData: {},
                balanceBefore: resp[0].wallet.balance,
                balanceAfter: resp[0].wallet.balance - (this.transferForm.value.amount * 100),
                source: "Wallet",
                destination: "Bank",
                narration: this.transferForm.value.narration,
                state: res.data.transfers[0].status== 'SUCCESS'? 'complete': "PENDING",
                isCredit: false,
                beneficiaryInfo: beneficiaryInfo,
                reference:res.data.transfers[0].reference,
              };
             

              user["wallet"] = uni.debitWallet(walletCheck.wallet, (this.transferForm.value.amount * 100));
              this.seedService.UpdateWallet(user).then(updateRes => {
                if (updateRes) {
                  delete user["transaction"];
                  localStorage.BaseUser = JSON.stringify(user);
                  this.seedService.refreshBalance(user.wallet.ledger_balance);
                  swal.fire('TRANSFER', 'Your transfer was successful<br> Transaction ID: <b>' + res.data.transfers[0].reference + '</b>', 'success');
                  this.router.navigate(['pages', 'transaction-result', res.data.transfers[0].reference], { queryParams: { page: 'transfer', pageTitle: 'TRANSFER' } })
                  var model = {
                    "from": uni.scheme,
                    "to": user.mobile,
                    "text": `${this.cp.transform(this.transferForm.value.amount, 'NGN', 'symbol-narrow')} was transferred to ${beneficiaryInfo.fullname}(${beneficiaryInfo.account_number}) from your wallet.`
                      + "\r\n" +
                      'Thank you for using ' + uni.scheme
                  }
                  this.seedService.sendSMS(model)
                  this.transferForm.reset();
                }
              });
            }else if((res.data.transfers[0].status === "FAILED")){
              swal.fire("TRANSFER", "Transfer failed at this moment, please try again later.", "info")
            }else {//NIP did not work
              swal.fire("TRANSFER", "Your fund was not transferred, please try again later.", "info")
            }

          })
        } else {
          walletCheck = uni.revertPreparePurchase(walletCheck.wallet, (this.transferForm.value.amount * 100));
          swal.fire('TRANSFER', 'You cannot proceed with this transfer<br> Reason: <b>' + walletCheck.reason.toUpperCase() + '</b>', 'info');
        }
      }
    })
  }

  clearAccNum() {
    this.transferForm.controls.account_number.setValue("");
  }

  resolveAccount() {
    this.isLoading = true;
    const model = {
      "account_number": this.transferForm.value.account_number,
      "bank_code": this.transferForm.value.account_bank
    }
    this.seedService.resolveSpectrumAccount(model)
      .then(data => {
        if (data.status === true && data.message === "Account number resolved") {
          this.beneficiary = data.data.account_name;
        } else if (data.status === false && data.message === "Could not resolve account name. Check parameters or try again.") {
          swal.fire('TRANSFER', 'Could not resolve account name. Check parameters or try again.', 'info')
        this.beneficiary="";
        } else {
          swal.fire('ADD CARD/ACCOUNT', 'An error occur, please try again later', 'info')
        }
        this.isLoading = false;
      })
  }


  banks() {
    this.bankSelect = [
      { "value": "044", "label": "Access Bank" },
      { "value": "063", "label": "Access Bank (Diamond)" },
      { "value": "035A", "label": "ALAT by WEMA" },
      { "value": "401", "label": "ASO Savings and Loans" },
      { "value": "023", "label": "Citibank Nigeria" },
      { "value": "050", "label": "Ecobank Nigeria" },
      { "value": "562", "label": "Ekondo Microfinance Bank" },
      { "value": "070", "label": "Fidelity Bank" },
      { "value": "011", "label": "First Bank of Nigeria" },
      { "value": "214", "label": "First City Monument Bank" },
      { "value": "058", "label": "Guaranty Trust Bank" },
      { "value": "030", "label": "Heritage Bank" },
      { "value": "301", "label": "Jaiz Bank" },
      { "value": "082", "label": "Keystone Bank" },
      { "value": "50211", "label": "Kuda Bank" },
      { "value": "526", "label": "Parallex Bank" },
      { "value": "076", "label": "Polaris Bank" },
      { "value": "101", "label": "Providus Bank" },
      { "value": "221", "label": "Stanbic IBTC Bank" },
      { "value": "068", "label": "Standard Chartered Bank" },
      { "value": "232", "label": "Sterling Bank" },
      { "value": "100", "label": "Suntrust Bank" },
      { "value": "032", "label": "Union Bank of Nigeria" },
      { "value": "033", "label": "United Bank For Africa" },
      { "value": "215", "label": "Unity Bank" },
      { "value": "035", "label": "Wema Bank" },
      { "value": "057", "label": "Zenith Bank" }
    ];
  }




}
