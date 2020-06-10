import { Component, OnInit } from '@angular/core';
import { SeedService } from '../../../../providers/seed.service';
import * as uni from '../../../../globals/universal';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  bu = JSON.parse(localStorage.BaseUser); private sorted = false
  isTransaction: boolean = false; dateForm: FormGroup;
  transactions = new Array();
  id: string;
  amount: string;
  transactionType: string;
  channel: string;
  narration: string;
  state: string;
  transactionDate: string;
  source: string;
  searchForm: FormGroup;
  transactionsCopy = new Array()
  p: number = 1;
  balanceBefore: string;
  balanceAfter: string;
  constructor(private seedService: SeedService, private cp: CurrencyPipe) { }

  ngOnInit() {
    this.getCollectionByUser();
    this.initForm()
    this.searchForm = new FormGroup({
      searchSelect: new FormControl('')
    });
  }
  sortBy(by: string | any): void {
    this.transactions.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });
    this.sorted = !this.sorted;
  }
  initForm() {
    this.dateForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required])
    })
  }
  getCollectionByUser() {
    swal.fire({
      title: "TRANSACTION HISTORY",
      text: 'The system is fetching your transaction history, please wait ...',
      timer: 60000,
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading();
      }
    })
    let model = {
      x: this.bu._id,
      scheme: uni.scheme,
    };
    this.seedService.getCollectionsByUserId(model)
      .then(collections => {
        if (collections.length === 0) {
          this.transactions = [];
          swal.close();
        } else {
          this.transactions = collections;
          this.transactionsCopy = this.transactions
          swal.close();
        }
      })
  }
  transactionsTable(query) {
    this.transactions = this.transactionsCopy;
    const re = RegExp(`.*${query.toLowerCase().split('').join('.*')}.*`);
    const matches = this.transactions.filter((v: any) => v['transferType'].toLowerCase().match(re))
    this.transactions = matches;
  };


  getTable(page) {
    this.p = page;
  }


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


  getRequiredData() {
    this.transactions = this.transactionsCopy;
    const startDate = this.dateForm.value.startDate.split('-');
    const endDate = this.dateForm.value.endDate.split('-');
    let start = new Date(startDate[0], parseInt(startDate[1]) - 1, startDate[2])
    let end = new Date(endDate[0], parseInt(endDate[1]) - 1, endDate[2])
    let transactionsArray = new Array()
    for (let doc of this.transactions) {
      let checkDate = doc['xCreatedAt'].split(" ");
      let check = new Date(checkDate[2].replace(',', ''), parseInt(checkDate[1]) - 1, checkDate[0])
      if (check >= start && check <= end) {
        transactionsArray.push(doc)
      }
    }
    this.transactions = transactionsArray;
    this.dateForm.reset()
  }
}
