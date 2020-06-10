import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SeedService } from '../../../providers/seed.service';
import * as uni from '../../../globals/universal';
import swal from 'sweetalert2';



@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.scss']
})
export class BankCardComponent implements OnInit {

  showCardForm: boolean = false;
  cardForm: FormGroup;
  bankSelect: Array<any> = [];
  total_amtKobo: string = '5000';
  verifiedCard: any;
  bu: any;
  lt_accountCards = new Array();
  isAgreed: boolean = false;
  checkAgree: any;
  isCard: boolean = false;
  cards: [];
  addCard: boolean = false
  userEmail: string;



  constructor(private seedService: SeedService) { }



  //   AddCardToggle(){
  // this.showCardForm = !this.showCardForm;
  //   }
  // status: true
  // message: "Account number resolved"
  // data: {account_number: "0121036486", account_name: "UDEOGU, CHEKWUBE CHRISTIAN", bank_id: 9}
  // __proto__: Object

  resolveAccount() {
    swal.fire({
      title: 'ADD BANK/CARD',
      text: 'System is verifying your data, please wait...',
      timer: 600000,
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    let accNoModel = {
      account_no: this.cardForm.value.acc_no,
      scheme: uni.scheme
    }
    this.seedService.checkCardAccountExists(accNoModel)
      .then(res => {
        if (res.status == true) {
          swal.fire('ADD CARD/ACCOUNT', 'This account already exists. Try another.', 'info')
        } else {
          const model = {
            "account_number": this.cardForm.value.acc_no,
            "bank_code": this.cardForm.value.bank
          }
          this.seedService.resolveSpectrumAccount(model)
            .then(data => {
              if (data.status === true && data.message === "Account number resolved") {
                let accountNameArray: [string] = data.data.account_name.split(" ")
                let accountCheck = accountNameArray.filter(res => res.replace(',', '').trim() === this.bu.fName.toUpperCase().trim() || res.replace(',', '').trim() === this.bu.sName.toUpperCase().trim())
                if (accountCheck.length === 2) {
                  document.getElementById('paystack').click();
                  this.accountResolved()
                }
                else {
                  swal.fire('ADD CARD/ACCOUNT', 'Account verification failed. Make sure your account details match the details on your profile.', 'info')
                }
              } else if (data.status === false && data.message === "Could not resolve account name. Check parameters or try again.") {
                swal.fire('ADD CARD/ACCOUNT', 'Could not resolve account name, ensure all your details are correct and retry.', 'info')
              } else {
                swal.fire('ADD CARD/ACCOUNT', 'An error occur', 'info')
              }

            })
        }
      })

  }


  toggleCard() {
    if (this.cards && this.cards.length > 1) {
      swal.fire('ADD CARD/ACCOUNT', 'You can only add a maximum of two(2) cards', 'info')
      return
    } else {
      this.addCard = !this.addCard
    }
  }


  accountResolved() {
    swal.close()
    var that = this
    document.addEventListener("ref", function (e: any) {
      swal.fire({
        title: "ADD BANK/CARD",
        text: 'System is verifying your data, please wait...',
        timer: 100000,
        type: "info",
        onBeforeOpen: () => {
          swal.showLoading()
        }
      })

      that.seedService.verifyTransactions(e.detail).then(data => {
        that.verifiedCard = data.data;

        if (that.verifiedCard.reference == e.detail) {
          let def = false; if (!that.bu.account_cards) { def = true; }
          let card = {
            xid: that.bu._id,
            scheme: uni.scheme,
            bank_code: that.cardForm.value.bank,
            account_no: that.cardForm.value.acc_no,
            authorization_code: that.verifiedCard.authorization.authorization_code,
            bin: that.verifiedCard.authorization.bin,
            last4: that.verifiedCard.authorization.last4,
            exp_month: that.verifiedCard.authorization.exp_month,
            exp_year: that.verifiedCard.authorization.exp_year,
            channel: that.verifiedCard.authorization.channel,
            card_type: that.verifiedCard.authorization.card_type,
            bank: that.verifiedCard.authorization.bank,
            country_code: that.verifiedCard.authorization.country_code,
            brand: that.verifiedCard.authorization.brand,
            default: def
          }
          // let card = {
          //   xid: that.bu._id,
          //   scheme: uni.scheme,
          //   bank_code: that.cardForm.value.bank,
          //   account_no: "8182445118",
          //   authorization_code: "AUTH_bmrd8v3jir",
          //   bin: "489354",
          //   last4: "1924",
          //   exp_month: that.verifiedCard.authorization.exp_month,
          //   exp_year: that.verifiedCard.authorization.exp_year,
          //   channel: that.verifiedCard.authorization.channel,
          //   card_type: that.verifiedCard.authorization.card_type,
          //   bank: that.verifiedCard.authorization.bank,
          //   country_code: that.verifiedCard.authorization.country_code,
          //   brand: that.verifiedCard.authorization.brand,
          //   default: def
          // }

          that.seedService.addBankAccountCard(card).then(res => {
            if (res._id && res._id !== -1) {
              that.bu = res;
              if (!that.bu.wallet) {
                res.wallet = { balance: 0, ledger_balance: 0, transaction_funds: 0 };
              }

              localStorage.BaseUser = ''; localStorage.BaseUser = JSON.stringify(res);
              that.lt_accountCards = res.account_cards;
              that.bu.account_cards = JSON.parse(localStorage.BaseUser).account_cards;
              that.cardForm.reset();
              that.toggleCard();
              Swal.fire('ACCOUNT/CARD REGISTRATION', 'CONGRATULATIONS, YOUR NEW CARD HAS BEEN REGISTERED!!', 'success');
              //  swal.fire('CARD SAVED',that.verifiedCard.authorization.bin+ '****' +that.verifiedCard.authorization.last4+' has been saved!','success');
              // this.addCard = false;


            } else if (res._id && res._id === -1) {
              swal.fire('ACCOUNT/CARD REGISTRATION', "Sorry, this card already exists", 'info')
              return
            } else {
              swal.fire('ACCOUNT/CARD REGISTRATION', "Something went wrong", 'warning');
              return;
            }
          });
        }
      }).catch(err => {
        if (err.error.message === "Transaction reference not found") {
          swal.fire("ADD CARD/ACCOUNT", 'Transaction reference not found', 'info')
        } else {
          swal.fire("ADD CARD/ACCOUNT", 'Something went wrong', 'info')
        }
      })

    });
  }

  ngOnInit() {
    this.banks();
    this.createForm();
    if (localStorage.BaseUser) {
      this.bu = JSON.parse(localStorage.BaseUser);
      this.cards = JSON.parse(localStorage.BaseUser).account_cards;
    }
    if (!this.cards) {
      this.cards = []
    }
  }


  deleteCardAccount(cardAccount) {
    swal.fire({
      title: "ACCOUNT DELETION",
      type: 'info',
      text: 'Please wait while we check your account',
      timer: 600000,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    let model = {
      xid: this.bu._id,
      scheme: uni.scheme,
    };
    this.seedService.getLoansByUserId(model).then(loans => {
      if (loans.length > 0) {
        if (loans[0].status == "Pending" || loans[0].status == "Disbursed") {
          swal.fire('EXISTING LOAN!', 'YOU CURRENTLY HAVE AN EXISTING LOAN!!<br>PLEASE "PAYBACK" BEFORE DELETING YOUR CARD', 'error');
        }
        else {
          swal.fire({
            title: '<strong>ACCOUNT DELETION</strong>',
            type: 'info',
            html: 'Your are about to remove your account<hr/>' + cardAccount.bank + ' [' + cardAccount.bin + ' ******* ' + cardAccount.last4 + ']',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              'Delete Account',
            confirmButtonAriaLabel: 'Delete Account',
            cancelButtonText:
              'Cancel',
            cancelButtonAriaLabel: 'Cancel'
          }).then((result) => {
            if (result.value) {
              this.deleteAccount(cardAccount);
            }
          })
        }
      } else {
        swal.fire({
          title: '<strong>ACCOUNT DELETION</strong>',
          type: 'info',
          html:
            'Your are about to remove your account<hr/>' +
            cardAccount.bank + ' [' + cardAccount.bin + ' ******* ' + cardAccount.last4 + ']',
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText:
            'Delete Account',
          confirmButtonAriaLabel: 'Delete Account',
          cancelButtonText:
            'Cancel',
          cancelButtonAriaLabel: 'Cancel'
        }).then((result) => {
          if (result.value) {
            this.deleteAccount(cardAccount);
          }
        })
      }
    })
  }

  deleteAccount(cardAccount) {
    // console.log('Delete account details: '+JSON.stringify(cardAccount));
    // console.log('All Accounts: '+JSON.stringify(this.bu.account_cards))
    for (var i = 0; i < this.bu.account_cards.length; i++) {
      if (cardAccount.account_no == this.bu.account_cards[i].account_no) {
        // console.log('Found Account: '+JSON.stringify(this.bu.account_cards[i]));
        this.bu.account_cards.splice(i, 1);
      }
    }

    let model = {
      _id: this.bu._id,
      account_cards: this.bu.account_cards,
    };
    this.seedService.updateAccountCards(model).then(details => {
      // console.log('Delete account details: '+JSON.stringify(details))
      if (details._id) {
        this.cards = this.bu.account_cards
        //  this.cards_count=this.bu.account_cards.length;
        localStorage.BaseUser = ''; localStorage.BaseUser = JSON.stringify(this.bu);
        swal.fire('ACCOUNT REMOVAL', cardAccount.bank + ' [' + cardAccount.bin + ' ******* ' + cardAccount.last4 + '] was removed successfully!!', 'success');
      }
    })
  }

  createForm() {
    this.cardForm = new FormGroup({
      bank: new FormControl('', Validators.compose([Validators.required])),
      acc_no: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)])),
      // email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
      // card_number:new FormControl('', Validators.compose([Validators.required,Validators.maxLength(19),Validators.minLength(16)])),
      // card_name: new FormControl('', Validators.compose([Validators.required,Validators.minLength(2)])),
      // expiry:new FormControl('', Validators.compose([Validators.required,Validators.maxLength(7),Validators.minLength(5)])),
      // cvc: new FormControl('', Validators.compose([Validators.required,Validators.maxLength(3),Validators.minLength(3)])),
      // checkAgree:new FormControl(false,Validators.compose([Validators.required,Validators.pattern('true')]))
    });
  }


  toggleCheckbox() {
    this.isAgreed = !this.isAgreed;
  }
  //   async cardSetUp(){
  //     const transaction = await Transaction.request(this.requestData); 

  //     if (this.card.isValid()) {
  //       try {
  //         transaction.setPaymentMethod('card', this.card);
  //       } catch(e) {
  //         console.log(e);
  //       }
  //     }else{
  //       console.log('not valid')
  //     }

  //   }

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


  // makePayment(){  
  //   console.log('Amt: '+this.total_amtKobo);console.log('cardNumber: '+this.xForm.value.card_number);console.log('cvc: '+this.xForm.value.cvc);
  //   console.log('Email: '+this.bu.customerDetails.EmailAddress);console.log('card_name: '+this.xForm.value.card_name);console.log('Bank: '+this.xForm.value.bank);console.log('acc_no: '+this.xForm.value.acc_no);

  //   let card_mm_yy=this.xForm.value.expiry.toString().split('/');
  //   // console.log('MM: '+card_mm_yy[0].toString().trim()+' YY: '+card_mm_yy[1].toString().trim())
  //   let card_month=card_mm_yy[0].toString().trim();let card_year=card_mm_yy[1].toString().trim();
  //     this.loadingCtrl.create({spinner: 'dots',message: 'Processing Charge...',duration: 60000,cssClass:'custom-loader-class'}).then((res)=>{
  //       res.present();
  //       res.onDidDismiss().then((dis) => {});
  //     });
  //     (<any>window).window.PaystackPlugin.chargeCard(
  //     (resp) =>{
  //       this.loadingCtrl.dismiss();
  //       this.loadingCtrl.create({spinner: 'dots',message: 'Saving Instructions...',duration: 60000,cssClass:'custom-loader-class'}).then((res)=>{
  //         res.present();
  //         res.onDidDismiss().then((dis) => {});
  //       });
  //             this.trx=resp.reference.replace("trx_","");
  //             this.resp=resp.gateway_response;
  //             this.seedService.verifyTransactions(resp.reference).then(data=>{
  //               this.verifiedCard=data.data;
  //               if(this.verifiedCard.reference==resp.reference)
  //               {
  //                 let def=false; if(!this.bu.account_cards){def=true;}

  //                 let card={
  //                   xid:this.bu._id,
  //                   scheme:uni.scheme,
  //                   bank_code: this.xForm.value.bank,
  //                   account_no: this.xForm.value.acc_no,
  //                   authorization_code: this.verifiedCard.authorization.authorization_code,
  //                   bin: this.verifiedCard.authorization.bin,
  //                   last4: this.verifiedCard.authorization.last4,
  //                   exp_month: this.verifiedCard.authorization.exp_month,
  //                   exp_year:this.verifiedCard.authorization.exp_year,
  //                   channel: this.verifiedCard.authorization.channel,
  //                   card_type: this.verifiedCard.authorization.card_type,
  //                   bank: this.verifiedCard.authorization.bank,
  //                   country_code: this.verifiedCard.authorization.country_code,
  //                   brand: this.verifiedCard.authorization.brand,
  //                   default:def
  //                 }
  //                   console.log('addBankCard model: '+JSON.stringify(card));
  //                 this.seedService.addBankAccountCard(card).then(res=>{ 
  //                   console.log('addBankCard: '+JSON.stringify(res));
  //                   if(res._id){
  //                     this.bu=res;
  //                     localStorage.BaseUser=''; localStorage.BaseUser=JSON.stringify(res); 
  //                     this.lt_accountCards=res.account_cards;
  //                     this.xForm.reset();
  //                     this.events.publish('updateLendingHomePage');
  //                    this.loadingCtrl.dismiss();this.modalCtrl.dismiss({reload: this.bu});
  //                    swal.fire('ACCOUNT/CARD REGISTRATION','CONGRATULATIONS, YOUR NEW CARD HAS BEEN REGISTERED!!','success');
  //                   //  swal.fire('CARD SAVED',this.verifiedCard.authorization.bin+ '****' +this.verifiedCard.authorization.last4+' has been saved!','success');

  //                   } 
  //                 });
  //               }
  //             })
  //       },
  //       (resp) =>{
  //       this.loadingCtrl.dismiss();
  //       // console.log("charge Error: "+ JSON.stringify(resp),this.trx);
  //       swal.fire('ACCOUNT/CARD REGISTRATION',"charge Error: "+ JSON.stringify(resp),'error')
  //       this.resp=resp.gateway_response;
  //     },
  //     {
  //     cardNumber: this.xForm.value.card_number,
  //     expiryMonth: card_month,
  //     expiryYear: card_year,
  //     cvc: this.xForm.value.cvc,
  //     email: this.bu.customerDetails.EmailAddress,
  //     amountInKobo: this.total_amtKobo,
  //     })

  // }



  // ACCOUNT/CARD REGISTRATION
  // CONGRATULATIONS, YdisabledOUR NEW CARD HAS BEEN REGISTERED!!



}