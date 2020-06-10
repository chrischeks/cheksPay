import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as uni from '../../../globals/universal';
import { SeedService } from '../../../providers/seed.service';
import { ManageLimitsComponent } from '../lending/manage-limits/manage-limits.component';

@Component({
  selector: 'app-fund-wallet',
  templateUrl: './fund-wallet.component.html',
  styleUrls: ['./fund-wallet.component.scss']
})
export class FundWalletComponent implements OnInit {
  baseUser: any = JSON.parse(localStorage.BaseUser)
  @Output() fundWallet = new EventEmitter<any>()
  cards: any;
  isAgreed: boolean = true;
  lt_account_cards = new Array();
  cards_count: number = 0;
  isSelected: boolean = false;
  selectedCard: any = null;
  isCardSelected: boolean = false;
  walletForm: FormGroup;

  constructor(private router: Router, private seedService: SeedService) { }

  ngOnInit() {
    if (!this.baseUser.account_cards) {

      this.addCardAlert()
    } else {
      this.cards = this.baseUser.account_cards
      for (var i = 0; i < this.cards.length; i++) {
        this.cards[i]["isSelected"] = false;
      }
      this.lt_account_cards = this.cards;
      this.cards_count = this.cards.length;

    }
    this.createForm()
  }

  createForm() {
    this.walletForm = new FormGroup({
      amount: new FormControl("", [Validators.required, Validators.min(1000)]),
    });
  }


  selectCard(x) {
    for (var i = 0; i < this.lt_account_cards.length; i++) {
      this.lt_account_cards[i].isSelected = false;
    }
    this.selectedCard = x;
    x.isSelected = true;
    this.isCardSelected = true;
  }




  onContinue() {
    swal.fire({
      title: '<strong>WALLET FUNDING</strong>',
      type: 'info',
      html:
        'Please confirm the details below <br><hr/>' +
        'To: ' + this.baseUser.fName + ' ' + this.baseUser.sName + '<br>' +
        'Amount: ' + this.walletForm.value.amount + ' NGN',
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
      title: 'FUND WALLET',
      text: 'Funding wallet in progress, please wait...',
      type: 'info',
      timer: 60000,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })

    for (var i = 0; i < this.cards.length; i++) {
      delete this.cards[i]["isSelected"];
    }
    this.baseUser["transaction"] = {
      scheme: uni.scheme,
      amount: this.walletForm.value.amount,
      transferType: "Card",
      transferProvider: "paystack",
      transferChannel: "web",
      transactionData: {},
      source: "Account",
      destination: "Wallet",
      narration: " wallet top up for: " + this.baseUser.fName + ' ' + this.baseUser.sName,
      state: "complete",
      isCredit: true,
      balanceBefore: this.baseUser.wallet.balance,
      balanceAfter: this.baseUser.wallet.balance + (this.walletForm.value.amount * 100),
      beneficiaryInfo: {
        _id: this.baseUser._id,
        fullname: this.baseUser.fName + ' ' + this.baseUser.sName,
        mobile: this.baseUser.mobile,
        qrCode: this.baseUser.qrCode,
        imageUrl: this.baseUser.imageUrl
      }
    };



    this.baseUser["wallet"] = uni.creditWallet(this.baseUser.wallet, (this.walletForm.value.amount * 100));
    // console.log('Wallet BU: ' + JSON.stringify(this.baseUser));
    // let model = { "authorization_code": this.selectedCard.authorization_code, "email": this.baseUser.customerDetails.EmailAddress, "amount": this.walletForm.value.amount + "00" }

    let model = { "authorization_code": this.selectedCard.authorization_code, "email": this.baseUser.email, "amount": this.walletForm.value.amount + "00" }

    swal.showLoading();
    this.seedService.chargeCard(model).then(data => {
      // console.log('PayStack Data: '+JSON.stringify(data.data)); console.log('PayStack Ref: '+JSON.stringify(data.data.reference)); 
      let trx = data.data.reference;
      console.log('Trx Gateway Response : ' + data.data.gateway_response); console.log(' Trx Status : ' + data.data.status);
      // this.is_payment_complete=true;
      if (data.data.status == 'success') {
        this.seedService.fundWallet(this.baseUser).then(updateRes => {
          console.log('======================================');
          // console.log('updateRes: ' + JSON.stringify(updateRes));
          if (updateRes) {
            delete this.baseUser["transaction"];
            localStorage.BaseUser = JSON.stringify(this.baseUser);
            this.seedService.refreshBalance(this.baseUser.wallet.ledger_balance)

            swal.fire('WALLET FUNDING SUCCESSFUL', 'Your funding was successful<br>Transaction ID: <b>' + trx + '</b>', 'success');
            this.walletForm.reset(); this.isCardSelected = false;
          }
        });
      } else {

        this.baseUser["wallet"] = uni.failedCreditWallet(this.baseUser.wallet, (this.walletForm.value.amount * 100));
        swal.fire('PAYMENT ISSUES', 'Could not charge your card', 'error');
      }
    },
      error => {
        // console.log(JSON.stringify(error));
        this.baseUser["wallet"] = uni.failedCreditWallet(this.baseUser.wallet, (this.walletForm.value.amount * 100));

        // swal.fire('PAYMENT ISSUES','Couln not charge your card<br> Reason: <b>' +JSON.stringify(error)+'</b>','error');
        swal.fire('PAYMENT ISSUES', 'Could not charge your card<br> <b>PLEASE CONFIRM YOUR ACCOUNT</b>', 'error');
      });

  }

  checkAgreed() {
    if (this.isAgreed) {
      this.isAgreed = false;
    } else { this.isAgreed = true; }
  }


  addCardAlert() {
    swal.fire(
      {
        title: "Fund Wallet",
        text: "First add a card to fund wallet",
        type: "info",
        confirmButtonText: "Add Card",
        backdrop: false
      })
      .then(res => {
        if (res.value) {
          this.router.navigate(['pages', 'cards'])
        }
      })
  }


  cardPage() {
    this.fundWallet.emit()
    this.router.navigate(['/pages/card'])
  }
}
