import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BillsServiceService } from '../bills/service/bills-service.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as uni from '../../../globals/universal'
import { SeedService } from '../../../providers/seed.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.component.html',
  styleUrls: ['./airtime.component.scss']
})
export class AirtimeComponent implements OnInit {
  airtimeForm: FormGroup;
  isLoading: boolean = false;
  isChecked: boolean = false;
  controlName: string;
  bu: any;
  balance: number = 0;
  ledgerBalance: number = 0;
  transaction_funds: number = 0;

  constructor(
    private billsService: BillsServiceService,
    private router: Router,
    private seedService: SeedService,
    private cp: CurrencyPipe) { }

  ngOnInit() {
    this.createForm();
    this.checkForWallet()
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
            'Kindly fund your wallet to carry out purchases<br><hr/>' +
            'A minimum of NGN 1000 is required<br>',
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText:
            'Create Wallet',
          confirmButtonAriaLabel: 'Create Wallet',
          cancelButtonText:
            'Cancel',
          cancelButtonAriaLabel: 'Cancel'
        }).then((result) => {
          if (result.value) {
            this.fundWallet()
          }
        })
      }
    }
  }

  fundWallet() {
    this.router.navigate(['/pages/fund-wallet'])
  }


  createForm() {
    this.airtimeForm = new FormGroup({
      phone: new FormControl('', [Validators.pattern('^[0-9]{10}$'), Validators.required]),
      amount: new FormControl('', Validators.required),
      mtn: new FormControl(false),
      etisalat: new FormControl(false),
      airtel: new FormControl(false),
      glo: new FormControl(false)
    });
  }

  checkChange(event, tempRef) {
    if (event.checked == true) {
      this.airtimeForm.controls.mtn.patchValue(false)
      this.airtimeForm.controls.etisalat.patchValue(false)
      this.airtimeForm.controls.airtel.patchValue(false)
      this.airtimeForm.controls.glo.patchValue(false)
      this.checkboxCondition(true, tempRef)
      this.isChecked = true
    } else {
      this.checkboxCondition(false);
      this.isChecked = false
    }
  }

  checkboxCondition(state, tempRef?) {
    const checkboxes = [{ id: 1, name: "mtn" }, { id: 2, name: "etisalat" }, { id: 3, name: "airtel" }, { id: 4, name: "glo" }]
    for (let box of checkboxes) {
      if (tempRef == box.id && state) {
        this.controlName = box.name
        this.airtimeForm.controls[this.controlName].patchValue(state)
      }
    }
  }




  onSubmit() {
    this.airtimeForm.value.phone = "0" + this.airtimeForm.value.phone;
    this.airtimeForm.value.serviceID = this.controlName;
    this.isLoading = true
    swal.fire({
      title: '<strong>AIRTIME PURCHASE</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        // 'Account: ' +uni.maskAccountNumber(this.xForm.value.accountSelect.account_no)+'<br>'+
        'Network: ' + this.airtimeForm.value.serviceID.toUpperCase() + '<br>' +
        'To: ' + this.airtimeForm.value.phone + '<br>' +
        'Amount: ' + this.cp.transform(this.airtimeForm.value.amount, "NGN", 'symbol-narrow'),
      // showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'MAKE PAYMENT',
      confirmButtonAriaLabel: 'MAKE PAYMENT',
      cancelButtonText: 'CANCEL',
      cancelButtonAriaLabel: 'CANCEL'
    }).then((result) => {
      if (result.value) {
        swal.fire({ timer: 60000, })
        delete this.airtimeForm.value.etisalat;
        delete this.airtimeForm.value.glo;
        delete this.airtimeForm.value.airtel;
        delete this.airtimeForm.value.mtn;
        this.processPayment();
      } else {
        this.isLoading = false;
        this.airtimeForm.reset();
      }
    })
  }


  processPayment() {
    swal.fire({
      title: "AIRTIME PURCHASE",
      type: 'info',
      text: 'Purchasing Airtime, please wait...',
      timer: 100000,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    const model = {
      x: this.bu._id,
      scheme: uni.scheme
    }
    this.seedService.getUserByUserId(model)
      .then(resp => {
        let walletCheck = uni.preparePurchase(resp[0].wallet, (this.airtimeForm.value.amount * 100));
        if (walletCheck.canProceed) {
          this.billsService.payBill(this.airtimeForm.value)
            .subscribe((res: any) => {
              console.log(res, 'oooooooo');

              if (res.Success == "TRANSACTION SUCCESSFUL") {
                const user = resp[0]
                user["transaction"] = {
                  scheme: uni.scheme,
                  amount: this.airtimeForm.value.amount,
                  transferType: "airtime",
                  transferProvider: "RubikPay",
                  transferChannel: "web",
                  transactionData: {},
                  balanceBefore: resp[0].wallet.balance,
                  balanceAfter: resp[0].wallet.balance - (this.airtimeForm.value.amount * 100),
                  source: "Wallet",
                  destination: "VTPass",
                  serviceType: this.airtimeForm.value.serviceID,
                  narration: this.airtimeForm.value.serviceID + " Airtime VTU to: " + this.airtimeForm.value.phone,
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
                user["wallet"] = uni.debitWallet(walletCheck.wallet, (this.airtimeForm.value.amount * 100));
                this.seedService.UpdateWallet(user).then(updateRes => {
                  if (updateRes) {
                    delete user["transaction"];
                    localStorage.BaseUser = JSON.stringify(user);
                    this.seedService.refreshBalance(user.wallet.ledger_balance);
                    swal.fire('PURCHASE SUCCESSFUL', 'Your purchase was successful<br> Transaction ID: <b>' + res.requestId + '</b>', 'success');
                    this.router.navigate(['pages', 'transaction-result', res['requestId']], { queryParams: { page: 'buy-airtime', pageTitle: 'AIRTIME' } })
                    this.airtimeForm.reset();
                    this.isLoading = false
                  }
                });
              }
            }, error => {
              walletCheck = uni.revertPreparePurchase(walletCheck.wallet, (this.airtimeForm.value.amount * 100));
              swal.fire({ text: error.error['Failed'], type: "error" });
              this.isLoading = false;
            }
            )
        } else {
          walletCheck = uni.revertPreparePurchase(walletCheck.wallet, (this.airtimeForm.value.amount * 100));
          swal.fire('AIRTIME PURCHASE', 'You cannot proceed with the purchase<br> Reason: <b>' + walletCheck.reason.toUpperCase() + '</b>', 'warning');
          this.isLoading = false;
        }


      }).catch(error => {
        swal.fire("AIRTIME PURCHASE", "An error occurred, please try again later", 'info');
      })
  }





  // onSubmit() {
  //   swal.showLoading();
  //   // const checkboxes = [{name: "mtn", value:this.airtimeForm.value.mtn}, 
  //   // {name:"etisalat", value:this.airtimeForm.value.etisalat}, 
  //   // {name:"airtel", value:this.airtimeForm.value.airtel}, 
  //   // {name:"glo", value:this.airtimeForm.value.glo}]
  //   // const checked = checkboxes.filter(box=> box.value == true)
  //   // if (checked.length < 1){
  //   //   swal.fire('', 'Select a network', 'info')
  //   //   return
  //   // }else if(checked.length > 1){
  //   //   swal.fire('', 'Select one network', 'info')
  //   //   return
  //   // }
  //   this.airtimeForm.value.phone = '0' + this.airtimeForm.value.phone;
  //   this.airtimeForm.value.serviceID = this.controlName;
  //   this.isLoading = true

  //   this.billsService.payBill(this.airtimeForm.value)
  //     .subscribe(res => {
  //       swal.fire({ text: res['Success'], type: "success", timer: 2000 })
  //         .then(() => {
  //           this.router.navigate(['pages', 'transaction-result', res['requestId']], { queryParams: { page: 'buy-airtime', pageTitle: 'AIRTIME' } })
  //           this.airtimeForm.reset();
  //           this.isLoading = false
  //         })
  //     }, error => {
  //       swal.fire({ text: error.error['Failed'], type: "error" });
  //       this.isLoading = false;
  //     }
  //     )
  // }


}
