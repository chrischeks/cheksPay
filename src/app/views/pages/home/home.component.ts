import { Component, OnInit } from '@angular/core';
import * as uni from '../../../globals/universal';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SeedService } from '../../../providers/seed.service';
import { FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  signInTitle = uni.signInTitle
  accountCreated: boolean = false;
  bu: any;
  balance: number = 0;
  ledgerBalance: number = 0;
  transaction_funds: number = 0;
  firstName: string = "";
  lastName: string = "";
  isTransaction: boolean = false;
  transactions = new Array();
  showBills: boolean = false;
  id: string;
  amount: string;
  transactionType: string;
  channel: string;
  narration: string;
  state: string;
  transactionDate: string;
  source: string;
  searchForm: FormGroup;
  transactionsCopy = new Array();
  p: number = 1;
  greetingText: string = '';
  isLoading:boolean= false;
  balanceBefore: string;
  balanceAfter: string
  backFromBills= this.route.snapshot.queryParamMap.get('bills')



  constructor(
    private router: Router, 
    private seedService: SeedService, 
    private cp:CurrencyPipe,
    private route: ActivatedRoute) {
    this.bu = JSON.parse(localStorage.BaseUser);
  }
  
  refreshBalance(){
    this.isLoading=true;
    const model = {
      x: this.bu._id,
      scheme: uni.scheme
    }
    this.seedService.getUserByUserId(model)
    .then(res=>{
      console.log(res, 'res')
      if(res[0]._id){
        this.balance = res[0].wallet.ledger_balance/100;
      }else{
        swal.fire("REFRESH BALANCE", "The system was unable to fetch your balance, please try again shortly", 'info')
      }
      this.isLoading=false
    }).catch(err=>{
      swal.fire("REFRESH BALANCE", "The system was unable to fetch your balance, please try again shortly", 'info')
      this.isLoading=false
    })
  }

  toggleBills() {
    this.showBills = !this.showBills
  }

  ngOnInit() {
    if(this.backFromBills){
      this.toggleBills()
    }
    this.getGreetings();
    // let userDetails=JSON.parse(localStorage.BaseUser);
    this.firstName = this.bu.fName;
    this.lastName = this.bu.sName;
    this.getCollectionByUser();
    this.seedService.$balanceChange.subscribe((ledgerBalance) => {
      this.balance = (ledgerBalance) / 100 || 0.00;
    });
    this.getBalance();
  }

  // getCollectionByUser() {
  //   swal.fire({
  //     title: "TRANSACTION HISTORY",
  //     text: 'The system is fetching your transaction history, please wait ...',
  //     timer: 60000,
  //     type: 'info',
  //     onBeforeOpen: () => {
  //       swal.showLoading();
  //     }
  //   })
  //   let model = {
  //     x: this.bu._id,
  //     scheme: uni.scheme,
  //   };
  //   this.seedService.getCollectionsByUserId(model)
  //     .then(collections => {
  //       if (collections.length === 0) {
  //         this.transactions = [];
  //         swal.close();
  //       } else {
  //         this.transactions = collections;
  //         this.transactionsCopy = this.transactions
  //         console.log(this.transactions, 'ppppp');

  //         swal.close();
  //       }
  //     })
  // }
  transactionsTable(query) {
    this.transactions = this.transactionsCopy;
    const re = RegExp(`.*${query.toLowerCase().split('').join('.*')}.*`);
    const matches = this.transactions.filter((v: any) => v['narration'].toLowerCase().match(re))
    this.transactions = matches.slice(0, 5);
  };



  viewTransaction(transaction) {
    this.id = transaction._id;
    this.amount = this.cp.transform(transaction.amount/100, 'NGN', 'symbol-narrow');
    this.channel = transaction.transferChannel;
    this.narration = transaction.narration;
    this.transactionType = transaction.transferType;
    this.state = transaction.state;
    this.source = transaction.source;
    this.transactionDate = transaction.xCreatedAt;
    this.balanceBefore = this.cp.transform(transaction.balanceBefore/100, 'NGN', 'symbol-narrow');
    this.balanceAfter =this.cp.transform(transaction.balanceAfter/100, 'NGN', 'symbol-narrow');
  }


  getBalance() {
    if (this.bu) {
      this.balance = (this.bu.wallet.ledger_balance * 1) / 100
    } else {
      this.balance = 0.00;
    }
  }

  getGreetings() {
    let today = new Date
    let currentHr = today.getHours()
    if (currentHr < 12) {
      this.greetingText = "Good Morning"
    } else if (currentHr < 18) {
      this.greetingText = "Good Afternoon"
    } else {
      this.greetingText = "Good Evening"
    }
  }


  checkForCard() {
    // if (!this.bu.account_cards || this.bu.account_cards.length === 0) {
      swal.fire({
        title: 'LOAN',
        text: 'Please add a bank card before requesting for loan',
        showCancelButton: true,
        confirmButtonText: 'Add card',
        type: 'info'
      }).then(res => {
        if (res.value) {
          this.router.navigate(['pages/cards'])
        }
      })
    // } else {
    //   this.router.navigate(['/pages/request-loan'])
    // }
  }

  checks() {
    if(!this.bu.account_cards || this.bu.account_cards.length === 0){
      this.checkForCard()
    }else if(this.bu.bvn === "") {
      this.checkForBVN()
    } else {
      this.router.navigate(['/pages/request-loan'])
    }
  }


  checkForBVN() {
    // if (this.bu.bvn === "") {
      swal.fire({
        title: 'LOAN',
        text: 'Please add your BVN to your profile',
        showCancelButton: true,
        confirmButtonText: 'Add BVN',
        type: 'info'
      }).then(res => {
        if (res.value) {
          this.router.navigate(['pages/profile'], { queryParams: { home: true } })
        }
      })
    // } else {
    //   this.checkForCard()
    // }
  }
  getCollectionByUser() {
    let model = {
      x: this.bu._id,
      scheme: uni.scheme,
    };
    this.seedService.getCollectionsByUserId(model)
      .then(collections => {
        if (collections.length === 0) {
          this.isTransaction = false
        } else {
          this.transactions = collections.slice(0, 5)
          this.isTransaction = true;
          this.transactionsCopy = collections
        }
      })
  }

}
