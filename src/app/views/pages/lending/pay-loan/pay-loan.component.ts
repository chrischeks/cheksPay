import { Component, OnInit } from '@angular/core';
import { SeedService } from '../../../../providers/seed.service';
import * as uni from '../../../../globals/universal';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import * as moment from "moment";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pay-loan',
  templateUrl: './pay-loan.component.html',
  styleUrls: ['./pay-loan.component.scss']
})
export class PayLoanComponent implements OnInit {
  baseUser: any = JSON.parse(localStorage.BaseUser)
  lt_account_cards = new Array();
  cards: any;
  cards_count: number = 0;
  loanId = this.route.snapshot.paramMap.get('loanId');
  selectedLoan
  repayAmount;
  isSelected: boolean = false;
  selectedCard: any = null;
  isCardSelected: boolean = false;
  constructor(
    private seedService: SeedService,
    private route: ActivatedRoute,
    private cp: CurrencyPipe,
    private router: Router) { }

  ngOnInit() {
    this.getLoansByUser();
    if (!this.baseUser.account_cards) {
      // this.addCardAlert()
    } else {
      this.cards = this.baseUser.account_cards
      for (var i = 0; i < this.cards.length; i++) {
        this.cards[i]["isSelected"] = false;
      }
      this.lt_account_cards = this.cards;
      this.cards_count = this.cards.length;
    }
  }


  selectCard(x) {
    for (var i = 0; i < this.lt_account_cards.length; i++) {
      this.lt_account_cards[i].isSelected = false;
    }
    this.selectedCard = x;
    x.isSelected = true;
    this.isCardSelected = true;
    console.log("Selected Card: " + JSON.stringify(this.selectedCard))
  }

  getLoansByUser() {
    let model = {
      xid: this.baseUser._id,
      scheme: uni.scheme,
    };
    this.seedService.getLoansByUserId(model).then(loans => {
      this.selectedLoan = loans.filter(data => data._id === this.loanId)
      console.log(this.selectedLoan[0].details[0], 'normal_amt');
      if (this.selectedLoan && this.selectedLoan.length > 0 && this.selectedLoan[0].details[0].interest) {
        this.repayAmount = uni.cal_online_charge(((this.selectedLoan[0].details[0].interest * 1) / 100));
      }
    })

  }



  onContinue() {
    swal.fire({
      title: '<strong>PAYBACK LOAN</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'From: ' + this.baseUser.fName + ' ' + this.baseUser.sName + '<br>' +
        'Amount: ' + `${this.cp.transform(this.repayAmount, 'NGN', 'symbol-narrow')}`,
      // showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'MAKE PAYMENT',
      confirmButtonAriaLabel: 'MAKE PAYMENT',
      cancelButtonText: 'CANCEL',
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
      title: "Repay Loan",
      text: "Processing your payment, please wait...",
      timer: 600,
      onBeforeOpen: () => {
        swal.showLoading();
      }
    })
    for (var i = 0; i < this.cards.length; i++) {
      delete this.cards[i]["isSelected"];
    }
    this.baseUser["transaction"] = {
      scheme: uni.scheme,
      amount: this.repayAmount + "00",
      transferType: "Card",
      transferProvider: "paystack",
      transferChannel: "web",
      transactionData: {},
      source: "Account",
      destination: "Wallet",
      narration: " Loan repayment for: " + this.baseUser.fName + ' ' + this.baseUser.sName,
      state: "complete",
      isCredit: true,
      beneficiaryInfo: {
        _id: this.baseUser._id,
        fullname: this.baseUser.fName + ' ' + this.baseUser.sName,
        mobile: this.baseUser.mobile,
        qrCode: this.baseUser.qrCode,
        imageUrl: this.baseUser.imageUrl
      }
    };

    let model = { "authorization_code": this.selectedCard.authorization_code, "email": this.baseUser.email, "amount": this.repayAmount + "00" }

    // swal.showLoading();
    this.seedService.chargeCard(model).then(data => {
      let trx = data.data.reference;
      // this.is_payment_complete=true;
      if (data.data.status == 'success') {

        let requestLoan = this.selectedLoan[0].details[0];
        let date = moment(Date.now()).format('DD MM YYYY, HH:mm:ss');
        requestLoan["_id"] = this.selectedLoan[0]._id;
        requestLoan.status = 'Repaid';
        requestLoan["repaymentDate"] = date;

        requestLoan["repaymentTransactionID"] = data.data.gateway_response;
        this.seedService.updateLoanStatusToRepaid(requestLoan).then(res => {
          var model = {
            "from": uni.scheme,
            "to": this.baseUser.mobile,
            // "to":"+2348034654797",
            "text": `Your ${this.cp.transform(this.repayAmount, 'NGN', 'symbol-narrow')} loan has been repaid \r\n` +
              'Thank you for using ' + uni.scheme + " Loans."
          }
          this.seedService.sendSMS(model).then(sms => {
            // this.doGetLoans();
            delete this.baseUser["transaction"];
            localStorage.BaseUser = JSON.stringify(this.baseUser);
            swal.fire('REPAYMENT SUCCESSFUL', 'Your loan has been repaid successfully<br>Transaction ID: <b>' + trx + '</b>', 'success');
            this.router.navigate(['/pages/home'])
            this.isCardSelected = false;
          })
        })
      }

    },
      error => {
        // console.log(JSON.stringify(error));
        // swal.fire('PAYMENT ISSUES','Couln not charge your card<br> Reason: <b>' +JSON.stringify(error)+'</b>','error');
        swal.fire('PAYMENT ISSUES', 'CoulD not charge your card<br> <b>PLEASE CONFIRM YOUR ACCOUNT</b>', 'error');
      });

  }

  // checkAgreed() {
  //   if (this.isAgreed) {
  //     this.isAgreed = false;
  //   } else { this.isAgreed = true; }
  // }


}
