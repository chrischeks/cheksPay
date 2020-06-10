import { Component, OnInit } from '@angular/core';
import { BillsServiceService } from './service/bills-service.service';
import { CustomValidators } from 'ngx-custom-validators';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as uni from '../../../globals/universal'
import { SeedService } from '../../../providers/seed.service';

interface Ierror {
  error: {
    Failed: any,
    content: any,
    error: any
  }
}

interface Isuccess {
  Success: any,
  token: string,
  pin: string,
  certUrl: string,
  requestId: string,
  serialNo: string
}



@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  constructor(private billsService: BillsServiceService, private router: Router, private seedService: SeedService) {
  }
  billForm: FormGroup
  optionsSelect
  isBillTypeSelected: boolean = false;
  billType
  selectedBillTypes = null
  selectedType
  variations: Array<any> = [];
  isLoading: boolean = false;
  isLoading1: boolean = false;
  packageName: string = "Package Name";
  device: string = "Device";
  name: string = '';
  // isCheckingBiller: boolean = false;
  billerVerified: boolean = false;
  bu: any;
  balance: number = 0;
  ledgerBalance: number = 0;
  transaction_funds: number = 0;
  transactionDetails: object;
  amount: number;
  billValue: string;
  billName: string;
  walletCheck: any;
  user: any;

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
            'Kindly create a wallet and fund it to carry out purchases<br><hr/>' +
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
    this.billForm = new FormGroup({
      serviceID: new FormControl({ value: "", disabled: true }),
      billersCode: new FormControl({ value: "", disabled: true }),
      variation_code: new FormControl({ value: "", disabled: true }),
      phone: new FormControl("", [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      amount: new FormControl(null),
      Insured_Name: new FormControl(null),
      Engine_Number: new FormControl(null),
      Chasis_Number: new FormControl(null),
      Vehicle_Make: new FormControl(null),
      Vehicle_Color: new FormControl(null),
      Vehicle_Model: new FormControl(null),
      Year_of_Make: new FormControl(null),
      Contact_Address: new FormControl(null)
    });
  }
  insuranceValidation() {
    this.billForm.controls.Insured_Name.setValidators(Validators.required);
    this.billForm.controls.Engine_Number.setValidators(Validators.required);
    this.billForm.controls.Chasis_Number.setValidators(Validators.required);
    this.billForm.controls.Vehicle_Make.setValidators(Validators.required);
    this.billForm.controls.Vehicle_Color.setValidators(Validators.required);
    this.billForm.controls.Vehicle_Model.setValidators(Validators.required);
    this.billForm.controls.Year_of_Make.setValidators([Validators.required, Validators.pattern('^[0-9]{4}$')]);
    this.billForm.controls.Contact_Address.setValidators(Validators.required);
    this.billForm.controls.billersCode.setValidators(Validators.required);
  }

  billTypeChange(event) {
    this.billForm.controls.serviceID.disable();
    this.billForm.controls.variation_code.disable();
    this.billForm.reset();
    this.isLoading = true;
    if (event.target.value) {
      this.billType = event.target.value;
      this.isBillTypeSelected = true;
      this.extraFields(this.billType);
      this.billForm.controls.serviceID.enable();
      this.selectedBillChange(this.billType)
    }
  }
  selectedBillChange(billType) {
    this.isLoading = true;
    if (billType == "Tv") {
      this.selectedBillTypes = [{ name: "Startimes", value: "startimes" },
      { name: "Gotv", value: 'gotv' }, { name: "Dstv", value: "dstv" }];
      this.device = "Smart card"
    } else if (billType == "Electricity") {
      this.selectedBillTypes = [{ name: "Portharcourt-Electric (PHED)", value: "portharcourt-electric" },
      { name: "Eko-Electric (EKEDC)", value: "eko-electric" }, { name: "Ikeja-Electric (IKEDC)", value: "ikeja-electric" },
      { name: "Jos-Electric (JEDplc)", value: "jos-electric" }, { name: "Kano-Electric (KEDCO)", value: "kano-electric" },
      { name: "Abuja-Electric (AEDC)", value: "abuja-electric" }, { name: "Ibadan-Electric (IBDC)", value: "ibadan-electric" }]
      this.device = "Meter"
    } else if (billType == "Waec") {
      this.selectedBillTypes = [{ name: "Waec-Registration", value: "waec-registration" },
      { name: "Waec-Result", value: "waec" }];
      this.billerVerified = true;
    } else if (billType == "Insurance") {
      this.selectedBillTypes = [{ name: "Third Party Motor Insurance - Universal Insurance", value: "ui-insure" }];
      this.device = "Plate";
    }
    this.isLoading = false
  }
  extraFields(billType) {
    if (billType == "Electricity") {
      this.billForm.controls.amount.setValidators([Validators.required, CustomValidators.digits]);
      // this.billForm.controls.billersCode.setValidators([Validators.required, Validators.pattern('^[0-9]{13}$')])
      this.billForm.controls.amount.updateValueAndValidity();
    } else if (billType == "Tv") {
      // this.billForm.controls.billersCode.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')])
    } else if (billType == 'Insurance') {
      this.insuranceValidation()
      this.billerVerified = true;
    }
    this.billForm.controls.billersCode.enable();
    this.billForm.controls.billersCode.updateValueAndValidity();
  }

  changeVariationCode(event) {
    this.billForm.controls.variation_code.setValue(event.target.value);
    for (let variation of this.variations) {
      if (variation.variation_code === event.target.value) {
        this.name = variation.name
        this.billForm.controls.amount.setValue(variation.variation_amount * 1)
      }
    }
  }


  selectedBill(event) {
    this.billValue = event.target.value;
    for (let bill of this.selectedBillTypes) {
      if (bill.value === event.target.value) {
        this.billName = bill.name;
      }
    }
    this.billForm.controls.variation_code.disable();
    this.billForm.controls.serviceID.setValue(event.target.value);
    this.isLoading = true; 0
    const name: string[] = event.target.value.split('-');
    if (name[0] != '') {
      this.packageName = name.map(x => x[0].toUpperCase() + x.slice(1)).join('-');
    }
    if (this.billType == "Tv" || this.billType == "Waec" || this.billType == "Insurance") {
      this.billsService.getVariations(event.target.value)
        .subscribe(res => {
          this.variations = res.content.varations
          this.billForm.controls.variation_code.enable();
          this.isLoading = false;
        })
    } else if (this.billType == "Electricity") {
      this.billForm.controls.variation_code.enable();
      this.isLoading = false;
    }
  }




  payBill() {
    swal.showLoading();
    this.isLoading1 = true;
    if (this.billType === "Insurance") {
      this.billForm.value.Plate_Number = this.billForm.value.billersCode;
    }
    this.billForm.value.phone = '0' + this.billForm.value.phone;


    if (this.billType === "Tv") {
      this.verifySmartcard()
      // this.onContinueTv();
    } else if (this.billType == "Electricity") {
      // this.onContinueElec();
      this.verifyMeter()
    } else if (this.billType === "Waec") {
      this.onContinueWaec()
    } else if (this.billType === "Insurance") {
      this.onContinueInsurance();
    }
  }



  onContinueInsurance() {
    swal.fire({
      title: '<strong>INSURANCE</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'Exam: ' + this.billForm.value.serviceID.toUpperCase() + '<br>' +
        'Package: ' + this.packageName + '<br>' +
        'Amount: ' + this.billForm.value.amount + ' NGN<br>',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        'MAKE PAYMENT',
      confirmButtonAriaLabel: ' MAKE PAYMENT',
      cancelButtonText:
        'CANCEL',
      cancelButtonAriaLabel: 'CANCEL'
    }).then((result) => {
      if (result.value) {

        const model = {
          x: this.bu._id,
          scheme: uni.scheme
        }
        this.seedService.getUserByUserId(model)
          .then(res => {
            this.user = res[0]
            this.transactionDetails = {
              scheme: uni.scheme,
              amount: this.billForm.value.amount,
              transferType: "third-party insurance",
              transferProvider: "RubikPay",
              transferChannel: "web",
              transactionData: {},
              source: "Wallet",
              balanceBefore: this.user.wallet.balance,
              balanceAfter: this.user.wallet.balance - (this.amount * 100),
              destination: "VTPass",
              serviceType: this.billForm.value.serviceID,
              narration: "'" + this.billValue + "' payment(" + this.billName + ") to " + this.billForm.value.phone,
              state: "complete",
              isCredit: false,
              beneficiaryInfo: {
                _id: this.user._id,
                fullname: this.user.fName + ' ' + this.user.sName,
                mobile: this.user.mobile,
                qrCode: this.user.qrCode,
                imageUrl: this.user.imageUrl
              }
            };
            this.walletCheck = uni.preparePurchase(this.user.wallet, (this.billForm.value.amount * 100));
            this.processPayment();
          }).catch(err => {
            this.isLoading1 = false;
            swal.fire('BILL PAYMENT', 'Something went wrong, please try again later', 'info')
          })
      } else {
        this.isLoading = false;
      }
    })
  }



  onContinueWaec() {
    swal.fire({
      title: '<strong>WAEC</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'Vendor: ' + this.billForm.value.serviceID.toUpperCase() + '<br>' +
        'Package: ' + this.packageName + '<br>' +
        'Amount: ' + this.billForm.value.amount + ' NGN<br>',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' MAKE PAYMENT',
      confirmButtonAriaLabel: ' MAKE PAYMENT',
      cancelButtonText:
        'CANCEL',
      cancelButtonAriaLabel: 'CANCEL'
    }).then((result) => {
      if (result.value) {

        const model = {
          x: this.bu._id,
          scheme: uni.scheme
        }
        this.seedService.getUserByUserId(model)
          .then(res => {
            this.user = res[0]
            this.transactionDetails = {
              scheme: uni.scheme,
              amount: this.billForm.value.amount,
              transferType: "waec",
              transferProvider: "RubikPay",
              transferChannel: "web",
              transactionData: {},
              balanceBefore: this.user.wallet.balance,
              balanceAfter: this.user.wallet.balance - (this.amount * 100),
              source: "Wallet",
              destination: "VTPass",
              serviceType: this.billForm.value.serviceID,
              narration: "'" + this.billValue + "' payment(" + this.billName + ") to " + this.billForm.value.phone,
              state: "complete",
              isCredit: false,
              beneficiaryInfo: {
                _id: this.user._id,
                fullname: this.user.fName + ' ' + this.user.sName,
                mobile: this.user.mobile,
                qrCode: this.user.qrCode,
                imageUrl: this.user.imageUrl
              }
            };
            this.walletCheck = uni.preparePurchase(this.user.wallet, (this.billForm.value.amount * 100));
            this.processPayment();
          }).catch(err => {
            swal.fire('BILL PAYMENT', 'Something went wrong, please try again later', 'info')
          })
      } else {
        this.isLoading = false;
      }
    })
  }



  onContinueTv(smartcardDetails) {
    swal.fire({
      title: '<strong>CABLE TV</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'Biller: ' + '<small>' + this.billForm.value.serviceID.toUpperCase() + '</small>' + '<br>' +
        'Package: ' + '<small>' + this.name + '</small>' + '<br>' +
        'Smart Card Number: ' + '<small>' + this.billForm.value.billersCode + '</small>' + '<br>' +
        'Customer Name: ' + '<small>' + smartcardDetails.content.Customer_Name + '</small>' + '<br>' +
        'Customer Number: ' + '<small>' + smartcardDetails.content.Customer_Number + '</small>' + '<br>' +
        'Status: ' + '<small>' + smartcardDetails.content.Status + '</small></i>',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        'MAKE PAYMENT',
      confirmButtonAriaLabel: ' MAKE PAYMENT',
      cancelButtonText:
        'CANCEL',
      cancelButtonAriaLabel: 'CANCEL'
    }).then((result) => {
      if (result.value) {
        swal.fire({
          type: 'info',
          title: "CABLE TV",
          text: 'Checking wallet, please wait...',
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
          .then(res => {
            this.user = res[0];
            this.transactionDetails = {
              scheme: uni.scheme,
              amount: this.billForm.value.amount,
              transferType: "cableTv",
              transferProvider: "RubikPay",
              transferChannel: "web",
              transactionData: {},
              balanceBefore: this.user.wallet.balance,
              balanceAfter: this.user.wallet.balance - (this.amount * 100),
              source: "Wallet",
              destination: "VTPass",
              serviceType: this.billForm.value.serviceID,
              narration: "'" + this.billValue + "' payment(" + this.billName + ") to account: " + this.billForm.value.billersCode,
              state: "complete",
              isCredit: false,
              beneficiaryInfo: {
                _id: this.user._id,
                fullname: this.user.fName + ' ' + this.user.sName,
                mobile: this.user.mobile,
                qrCode: this.user.qrCode,
                imageUrl: this.user.imageUrl
              }
            };
            this.walletCheck = uni.preparePurchase(this.user.wallet, (this.billForm.value.amount * 100));
            this.processPayment();
          }).catch(err => {
            this.isLoading1 = false;
            swal.fire('BILL PAYMENT', 'Something went wrong, please try again later', 'info')
          })
      } else {
        this.isLoading1 = false;
      }
    })
  }


  verifySmartcard() {
    swal.fire({
      title: 'CABLE TV',
      text: "Verifying smartcard. Please wait...",
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading()
      },
      timer: 60000
    })
    const checks = this.billForm.value.serviceID && this.billForm.value.billersCode && this.billForm.value.variation_code
    const formRef = this.billForm.value;
    if (checks) {
      this.billsService.verifySmartcard(formRef)
        .subscribe((resData: any) => {
          if (resData.Success && checks) {
            this.onContinueTv(resData.Success)
          }
        }, error => {
          this.isLoading1 = false
          swal.fire({ title: "SMARTCARD VERIFICATION", text: error.error.Failed || error.error.content || error.error.error, type: "error" })
        })
    }
  }

  // 4254132476
  verifyMeter() {
    swal.fire({
      title: 'ELECTRICITY',
      text: "Verifying meter. Please wait...",
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading()
      },
      timer: 6000
    })
    const checks = this.billForm.value.serviceID && this.billForm.value.billersCode && this.billForm.value.variation_code
    const formRef = this.billForm.value;
    if (checks) {
      this.billsService.verifyElectricMeter(formRef)
        .subscribe((resData: any) => {
          if (resData.Success && checks) {
            this.onContinueElec(resData.Success)
          }
        },
          error => {
            this.isLoading1 = false
            swal.fire({ title: "METER VERIFICATION", text: error.error.Failed || error.error.content || error.error.error, type: "error" })
          })
    }

  }


  onContinueElec(meterDetails) {
    swal.fire({
      title: '<strong>ELECTRICITY</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'Vendor: ' + '<i><small>' + this.billName.toUpperCase() + '</small></i>' + '<br>' +
        'Package: ' + '<i><small>' + this.packageName.toUpperCase() + '</small></i>' + '<br>' +
        'Amount: ' + '<i><small>' + this.billForm.value.amount + 'NGN' + '</small></i>' + ' <br>' +
        'Meter Number: ' + '<i><small>' + this.billForm.value.billersCode + '</small></i>' + '<br>' +
        'Customer Name: ' + '<i><small>' + meterDetails.content.Customer_Name + '</small></i>' + '<br>' +
        'Address: ' + '<i><small>' + meterDetails.content.Address + '</small></i>' + '<br>',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'MAKE PAYMENT',
      confirmButtonAriaLabel: ' MAKE PAYMENT',
      cancelButtonText: 'CANCEL',
      cancelButtonAriaLabel: 'CANCEL'
    }).then((result) => {
      if (result.value) {
        swal.fire({
          type: 'info',
          title: "ELECTRICITY",
          text: 'Checking wallet, please wait...',
          timer: 60000,
          onBeforeOpen: () => {
            swal.showLoading();
          }
        })

        const model = {
          x: this.bu._id,
          scheme: uni.scheme
        }
        this.seedService.getUserByUserId(model)
          .then(res => {
            this.user = res[0]
            this.transactionDetails = {
              scheme: uni.scheme,
              amount: this.billForm.value.amount,
              transferType: "Electricity",
              transferProvider: "RubikPay",
              transferChannel: "web",
              transactionData: {},
              balanceBefore: this.user.wallet.balance,
              balanceAfter: this.user.wallet.balance - (this.amount * 100),
              source: "Wallet",
              destination: "VTPass",
              serviceType: this.billForm.value.serviceID,
              narration: "'" + this.billValue + "' payment(" + this.billName + ") to account: " + this.billForm.value.billersCode,
              state: "complete",
              isCredit: false,
              beneficiaryInfo: {
                _id: this.user._id,
                fullname: this.user.fName + ' ' + this.user.sName,
                mobile: this.user.mobile,
                qrCode: this.user.qrCode,
                imageUrl: this.user.imageUrl
              }
            };
            this.walletCheck = uni.preparePurchase(this.user.wallet, (this.billForm.value.amount * 100));
            this.processPayment();
          }).catch(err => {
            this.isLoading1 = false;
            swal.fire('BILL PAYMENT', 'Something went wrong, please try again later', 'info')
          })
      } else {
        this.isLoading1 = false;
      }
    })
  }

  processPayment() {
    swal.fire({
      type: 'info',
      title: "BILL PAYMENT",
      text: 'Paying bill, please wait...',
      timer: 100000,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    this.isLoading1 = true
    swal.showLoading();
    if (this.walletCheck.canProceed) {

      this.billsService.payBill(this.billForm.value)
        .subscribe((res: Isuccess) => {
          // 5e6c81e85dad1f5d43be76f4
          // Tony's elec token= 5e6ca969525a9f5d0482386f
          if (res.Success == "TRANSACTION SUCCESSFUL") {
            this.transactionDetails["token"] = `token:${res.token}` || `certURl: ${res.certUrl}` || `serialNo:${res.serialNo}- pin:${res.pin}`;
            this.user["transaction"] = this.transactionDetails
            this.user["wallet"] = uni.debitWallet(this.walletCheck.wallet, (this.billForm.value.amount * 100));
            this.seedService.UpdateWallet(this.user).then(updateRes => {
              if (updateRes) {
                delete this.user["transaction"];
                localStorage.BaseUser = JSON.stringify(this.user);
                this.seedService.refreshBalance(this.user.wallet.ledger_balance);
                swal.fire('PURCHASE SUCCESSFUL', 'Your purchase was successful<br> Transaction ID: <b>' + res.requestId + '</b>', 'success');
                this.router.navigate(['pages', 'transaction-result', res.requestId], {
                  queryParams: {
                    page: 'pay-bills',
                    token: res.token, pageTitle: 'BILLS', serialNo: res.serialNo, pin: res.pin, certURL: res.certUrl
                  }
                });
                this.billForm.reset();
                this.isLoading1 = false
              }
            });
          }
        }, error => {
          this.walletCheck = uni.revertPreparePurchase(this.walletCheck.wallet, (this.billForm.value.amount * 100));
          swal.fire({ text: error.error['Failed'], type: "error" });
          this.isLoading1 = false;
        })
    } else {
      this.walletCheck = uni.revertPreparePurchase(this.walletCheck.wallet, (this.billForm.value.amount * 100));
      swal.fire('BILL PAYMENT', 'You cannot proceed with the purchase<br> Reason: <b>' + this.walletCheck.reason.toUpperCase() + '</b>', 'warning');
      this.isLoading1 = false;
    }
  }
}
