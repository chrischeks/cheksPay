import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import   * as uni from '../../../globals/universal';
@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrls: ['./user-footer.component.scss']
})
export class UserFooterComponent implements OnInit {
  date:string='2020';footerURL:string=uni.footerURL;footerText:string=uni.footerText
  constructor() { }

  ngOnInit() {
    this.date= moment(Date.now()).format('YYYY');
  }

}
