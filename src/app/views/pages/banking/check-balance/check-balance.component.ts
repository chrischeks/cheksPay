import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SeedService} from '../../../../providers/seed.service';
import swal from 'sweetalert2';
import * as uni from '../../../../globals/universal'

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.scss']
})
export class CheckBalanceComponent implements OnInit {
  bu:any;
  constructor(private seedService:SeedService,public router: Router) {
    if(localStorage.BaseUser){this.bu=JSON.parse(localStorage.BaseUser);this.getBalance();}
    else {
      swal.fire('Balance Error!','WE COULD NOT GET YOUR DETAILS AT THIS TIME','error');this.router.navigate(['/pages/home']);
    }
    
   }

  ngOnInit() {
  }
  getBalance(){
    swal.fire({
      title: 'Retrieving Balance! Please wait...',
      imageUrl: '../../../assets/img/logo.png',
      customClass: { image: 'modalLogo' },
      imageAlt: uni.signInTitle,
      animation: true,
      allowOutsideClick:false,
      timer:20000
    });
    swal.showLoading();
    let model={
      account:this.bu.mobile.replace('+234','')
    }
    this.seedService.getSpectrumBalance(model).then(body=>{
      if(body.ResponseCode==0)
      {
        swal.fire({
          title: '<strong>BALANCE ENQUIRY</strong>',
          type: 'success',
          html:
            'YOUR CURRENT BALANCE IS<br>' +
            '<h6><b>'+body.Payload.AccountBalance+' NGN</b></h6><br>'+
            '<h6>Account Status: <b>'+body.Payload.Status+'</b></h6>'
        });
        this.router.navigate(['/pages/home']);swal.hideLoading();
      }
      else{
        swal.fire({
          title: '<strong>BALANCE ENQUIRY</strong>',
          type: 'error',
          html: '<h6><b>'+body.ErrorDetails+'</b></h6>'
        });
        this.router.navigate(['/pages/home']);swal.hideLoading();
      }
    })

  }
}
