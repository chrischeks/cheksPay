import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-result',
  templateUrl: './transaction-result.component.html',
  styleUrls: ['./transaction-result.component.scss']
})
export class TransactionResultComponent implements OnInit {
  refId: string = this.route.snapshot.paramMap.get('ref');
  pageTitle = this.route.snapshot.queryParamMap.get('pageTitle');
  page = this.route.snapshot.queryParamMap.get('page');
  // purchasedCode = this.route.snapshot.queryParamMap.get('purchasedCode');
  certURL =this.route.snapshot.queryParamMap.get('certURL');
  serialNo = this.route.snapshot.queryParamMap.get('serialNo');
  pin = this.route.snapshot.queryParamMap.get('pin');
  token = this.route.snapshot.queryParamMap.get('token');

  


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

  }

}
