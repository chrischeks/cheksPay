import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SeedService } from '../../../providers/seed.service';
import swal from 'sweetalert2';
import * as uni from '../../../globals/universal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
forgotPasswordForm: FormGroup;
reference ="";
title="";
bu:any
isMobileConfirmed: boolean = false
  constructor(private seedService: SeedService, private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }


  createForm() {
    this.forgotPasswordForm = new FormGroup({
      mobile:new FormControl("", [Validators.pattern('^[0-9]{11}$'), Validators.required]),
    regCode: new FormControl({disabled: true, value:""} ),
    xpin: new FormControl({disabled: true, value:""})

    });
  }

  // onSubmit(){
  //   this.seedService.updateForgotPassword(this.forgotPasswordForm.value)
  //   .then(res=>{
  //     console.log(res, 'wwww');
      
  //   })
  // }

  paymentInit() {
    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    this.title = 'Payment successfull';
    console.log(this.title, ref);
  }

  paymentCancel() {
    console.log('payment failed');
  }



  getCode(){
    swal.fire({
      title:'CHANGE PASSWORD',
      text:'We will send your code to your registered mobile number, please wait',
      imageUrl:'../../../../assets/img/logo.png',
      customClass:{image:"modalLogo"},
      timer:10000,
      onBeforeOpen:()=>{
        swal.showLoading();
      }
    })
   let model={
     "to":'+234'+this.forgotPasswordForm.value.mobile.replace('0', ''),
     "from":uni.scheme,
     "text":" is your reset code .\The "+uni.scheme+ " Team"
     };
     this.seedService.getCode(model).then(msg=>{
       if(msg.qrCode.length==6){
         this.bu=msg;
         this.isMobileConfirmed=true;
         this.forgotPasswordForm.controls.regCode.enable();
         this.forgotPasswordForm.controls.regCode.setValidators([Validators.required,Validators.maxLength(6),Validators.minLength(6)])
         this.forgotPasswordForm.controls.xpin.enable();
         this.forgotPasswordForm.controls.xpin.setValidators([Validators.required,Validators.maxLength(6),Validators.minLength(6)])


         swal.fire('Code Sent!','A CODE HAS BEEN SENT TO YOUR MOBILE NUMBER<br> PLEASE ENTER THE CODE TO RESET YOUR PIN','success')
       }
       else{
         swal.fire('Reset Issues!','PLEASE CONFIRM YOUR MOBILE NUMBER AND TRY AGAIN','error')
       }
      
     })
 }
 


 resetPassword(){
   swal.showLoading();
  if(this.bu.qrCode.toLowerCase()==this.forgotPasswordForm.value.regCode.toLowerCase()){

 let model={
   qrCode:this.forgotPasswordForm.value.regCode.toUpperCase(),
   xPin:this.forgotPasswordForm.value.xpin,
   _id:this.bu._id
   };
   this.seedService.changePassword(model).then(doc=>{ 
     if(doc){
       this.router.navigate(['/login']);
       swal.fire('PIN RESET!','YOUR PIN HAS BEEN CHANGED SUCCESSFULLY<br> PLEASE SIGN IN WITH YOUR NEW DETAILS','success')
      this.forgotPasswordForm.reset();
      }  
   });
  }
  else{
   swal.fire('CODE ISSUES!','PLEASE CONFIRM YOUR CODE AND TRY AGAIN','error')
  }

 
}

  
}
