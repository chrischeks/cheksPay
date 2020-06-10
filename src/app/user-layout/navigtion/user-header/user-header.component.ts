import { Component, OnInit } from '@angular/core';
import { SeedService } from '../../../providers/seed.service';
import swal from 'sweetalert2';
import { CheckBalanceComponent } from '../../../views/pages/banking/check-balance/check-balance.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  bu = localStorage.BaseUser
  balance
  accountNo
  constructor(private seedService: SeedService, private router: Router) {


  }

  ngOnInit() {
    this.seedService.$balanceChange.subscribe((ledgerBalance) => {
      this.balance = (ledgerBalance) / 100 || 0.00;
    });
    this.getBalance();
    this.getAccountNum();
    let userDetails = JSON.parse(this.bu);
    this.firstName = userDetails.fName;
    this.lastName = userDetails.sName;

  }


  getBalance() {
    if (JSON.parse(this.bu).wallet) {
      this.balance = (JSON.parse(this.bu).wallet.ledger_balance * 1) / 100;
    } else {
      this.balance = 0.00;
    }

    // let model = {
    //   account: JSON.parse(this.bu).mobile.replace('+234', '')
    // }

    // this.seedService.getSpectrumBalance(model).then(body => {
    //   if (body.ResponseCode && body.ResponseCode == 0) {
    //     this.balance = body.PayLoad.AccountBalance;
    //   }

    // })
  }

  getAccountNum() {
    this.accountNo = JSON.parse(this.bu).mobile.replace('+234', '')
  }

  logOut() {
    localStorage.removeItem('BaseUser');
    if (!localStorage.BaseUser) {
      this.router.navigate(['/login'])
    }
  }
}
