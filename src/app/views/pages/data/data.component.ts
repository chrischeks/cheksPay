import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { BillsServiceService } from '../bills/service/bills-service.service';
import { Router } from '@angular/router';
import * as uni from '../../../globals/universal'
import { SeedService } from '../../../providers/seed.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  dataForm: FormGroup;
  isChecked: boolean;
  isLoading: boolean = false;
  packageName: string = "Data Packages";
  variations
  controlName: string;
  bu: any;
  balance: number = 0;
  ledgerBalance: number = 0;
  transaction_funds: number = 0;
  amount: number

  constructor(
    private billsService: BillsServiceService,
    private router: Router,
    private seedService: SeedService,
    private cp: CurrencyPipe) { }

  ngOnInit() {
    this.createForm();
    this.checkForWallet();
  }

  checkForWallet() {
    if (localStorage.BaseUser) {
      this.bu = JSON.parse(localStorage.BaseUser);
      if (this.bu.wallet) {
        this.balance = (this.bu.wallet.balance * 1) / 100;
        this.ledgerBalance = (this.bu.wallet.ledger_balance * 1) / 100;
        this.transaction_funds = (this.bu.wallet.transaction_funds * 1) / 100;
      }
      else {//No wallet
        swal.fire({
          title: '<strong>NO WALLET</strong>',
          type: 'info',
          html:
            'Kindly create a wallet and fund it to carry out purchases<br><hr/>' +
            'A minimum of NGN 1000 is required<br>',
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: 'Create Wallet',
          confirmButtonAriaLabel: 'Create Wallet',
          cancelButtonText: 'Cancel',
          cancelButtonAriaLabel: 'Cancel'
        }).then((result) => {
          if (result.value) {
            this.fundWallet();
          }
        })
      }
    }
  }


  fundWallet() {
    this.router.navigate(['/pages/fund-wallet'])
  }

  createForm() {
    this.dataForm = new FormGroup({
      phone: new FormControl('', [Validators.pattern('^[0-9]{11}$'), Validators.required]),
      variation_code: new FormControl({ value: "", disabled: true }, Validators.required),
      mtn: new FormControl(""),
      etisalat: new FormControl(""),
      airtel: new FormControl(""),
      glo: new FormControl("")
    });
  }

  checkChange(event, tempRef) {
    this.dataForm.controls.variation_code.reset()
    if (event.checked == true) {
      this.dataForm.controls.mtn.patchValue(false)
      this.dataForm.controls.etisalat.patchValue(false)
      this.dataForm.controls.airtel.patchValue(false)
      this.dataForm.controls.glo.patchValue(false)
      this.isChecked = true;
      this.checkboxCondition(event, this.isChecked, tempRef)
    } else {
      this.isChecked = false
      this.checkboxCondition(event, this.isChecked, tempRef);
    }
  }

  checkboxCondition(event, state, tempRef?) {
    const checkboxes = [{ id: 1, name: "Mtn" }, { id: 2, name: "9Mobile" }, { id: 3, name: "Airtel" }, { id: 4, name: "Glo" }]
    for (let box of checkboxes) {
      if (tempRef === box.id && state) {
        this.isLoading = true;
        this.packageName = box.name;
        this.controlName = box.name === "9Mobile" ? "Etisalat".toLowerCase() : box.name.toLowerCase()
        this.dataForm.controls[this.controlName].patchValue(state);
        this.dataForm.controls[this.controlName].updateValueAndValidity()
        this.selectedNetwork(this.controlName);
      } else if (tempRef !== box.id && !state) {
        this.controlName = "";
        this.packageName = "Data Packages";
        this.dataForm.controls.variation_code.disable();
      }
    }
  }


  selectedNetwork(network) {
    this.dataForm.controls.variation_code.disable();
    this.billsService.getVariations(`${network}-data`)
      .subscribe(res => {
        this.variations = res.content.varations
        this.dataForm.controls.variation_code.enable();
        this.isLoading = false;
      })
  }

  selectedOption(event) {
    this.dataForm.controls.variation_code.setValue(event.target.value);
    for (let variation of this.variations) {
      if (variation.variation_code === event.target.value) {
        this.amount = variation.variation_amount;
      }
    }
  }


  onSubmit() {
    this.dataForm.value.phone = this.dataForm.value.phone;
    this.dataForm.value.billersCode = this.dataForm.value.phone;
    this.dataForm.value.serviceID = `${this.controlName}-data`;
    swal.fire({
      title: '<strong>DATA PURCHASE</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'Network: ' + this.dataForm.value.serviceID.toUpperCase() + '<br>' +
        'To: ' + this.dataForm.value.phone + '<br>' +
        'Package: ' + this.dataForm.value.variation_code + '<br>' +
        'Cost: ' + this.cp.transform(this.amount, 'NGN', "symbol-narrow"),
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' MAKE PAYMENT',
      confirmButtonAriaLabel: 'MAKE PAYMENT',
      cancelButtonText:
        'CANCEL',
      cancelButtonAriaLabel: 'CANCEL'
    }).then((result) => {
      if (result.value) {
        this.processPayment();
      }
    })
  }


  processPayment() {
    swal.fire({
      type: 'info',
      title: "DATA PURCHASE",
      text: 'Purchasing Data, please wait...',
      timer: 100000,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    const model = {
      x: this.bu._id,
      scheme: uni.scheme
    }
    this.seedService.getUserByUserId(model).then(resp => {
      if (resp[0]._id) {
        this.isLoading = true
        let walletCheck = uni.preparePurchase(resp[0].wallet, (this.amount * 100));
        if (walletCheck.canProceed) {
          this.billsService.payBill(this.dataForm.value)
            .subscribe((res: any) => {
              if (res.Success == "TRANSACTION SUCCESSFUL") {
                // 09079054908
                let user = resp[0]

                user["transaction"] = {
                  scheme: uni.scheme,
                  amount: this.amount,
                  transferType: "airtimeData",
                  transferProvider: "RubikPay",
                  transferChannel: "web",
                  transactionData: {},
                  balanceBefore: resp[0].wallet.balance,
                  balanceAfter: resp[0].wallet.balance - (this.amount * 100),
                  source: "Wallet",
                  destination: "VTPass",
                  serviceType: this.dataForm.value.serviceID,
                  narration: this.controlName + " Airtime Data to: " + this.dataForm.value.phone,
                  state: "complete",
                  isCredit: false,
                  beneficiaryInfo: {
                    _id: user._id,
                    fullname: user.fName + ' ' + user.sName,
                    mobile: user.mobile,
                    qrCode: user.qrCode,
                    imageUrl: user.imageUrl
                  }
                };
                user["wallet"] = uni.debitWallet(walletCheck.wallet, (this.amount * 100));
                this.seedService.UpdateWallet(user).then(updateRes => {
                  if (updateRes) {
                    delete user["transaction"];
                    localStorage.BaseUser = JSON.stringify(user);
                    this.seedService.refreshBalance(user.wallet.ledger_balance);
                    swal.fire('PURCHASE SUCCESSFUL', 'Your purchase was successful<br> Transaction ID: <b>' + res.requestId + '</b>', 'success');
                    this.router.navigate(['pages', 'transaction-result', res['requestId']], { queryParams: { page: 'buy-data', pageTitle: 'DATA' } })
                    this.dataForm.reset();
                    this.isLoading = false
                  }
                });
              }
            }, error => {
              walletCheck = uni.revertPreparePurchase(walletCheck.wallet, (this.amount * 100));
              swal.fire({ text: error.error['Failed'], type: "error" });
              this.isLoading = false;
            }
            )
        } else {
          walletCheck = uni.revertPreparePurchase(walletCheck.wallet, (this.amount * 100));
          swal.fire('WALLET ISSUES', 'You cannot proceed with the purchase<br> Reason: <b>' + walletCheck.reason.toUpperCase() + '</b>', 'warning');
          this.isLoading = false;
        }
      } else {
        swal.fire('DATA PURCHASE', 'Sorry your Id was not found, you cannot proceed with the purchase', 'info');
      }
    }).catch(err => {
      swal.fire("DATA PURCHASE", "Something went wrong, please try again later", 'info')
    })
  }

  // onSubmit() {
  //   swal.showLoading();
  //   this.dataForm.value.phone = '0' + this.dataForm.value.phone;
  //   this.dataForm.value.billersCode = this.dataForm.value.phone;
  //   this.dataForm.value.serviceID = `${this.controlName}-data`;
  //   this.isLoading = true

  //   this.billsService.payBill(this.dataForm.value)
  //     .subscribe(res => {
  //       swal.fire({ text: res['Success'], type: "success", timer: 2000 })
  //         .then(() => {
  //           this.router.navigate(['pages', 'transaction-result', res['requestId']], { queryParams: { page: 'buy-data', pageTitle: 'DATA' } })
  //           this.dataForm.reset();
  //           this.isLoading = false
  //         })
  //     }, error => {
  //       swal.fire({ text: error.error['Failed'], type: "error" });
  //       this.isLoading = false;
  //     }
  //     )
  // }
}
