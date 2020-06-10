import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SeedService } from '../../../providers/seed.service';
import * as uni from '../../../globals/universal';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  xForm: FormGroup; signInTitle = uni.signInTitle;

  constructor(private router: Router, public formBuilder: FormBuilder, private seedService: SeedService) {
    this.xForm = this.formBuilder.group({
      mobile: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6)]))
    });
  }

  ngOnInit() {

  }


  // loginUser() {

  //   swal.fire({
  //     imageUrl: '../../../../assets/img/logo.png',
  //     title: 'Signing in! Please wait...',
  //     customClass: { image: "modalLogo" },
  //     imageAlt: uni.signInTitle,
  //     animation: true,
  //     allowOutsideClick: false,
  //     timer: 20000,
  //     onBeforeOpen: () => {
  //       swal.showLoading();
  //     }
  //   });
  //   let model = {
  //     mobile: '+234' + this.xForm.value.mobile.substring(1),
  //     pin: this.xForm.value.password,
  //     scheme: uni.scheme
  //   };

  //   this.seedService.login(model).then(doc => {
  //     if(doc.data && doc.data.auth && doc.data.user){
  //       localStorage.LogonDate = JSON.stringify(Date.now());
  //       localStorage.BaseUser = JSON.stringify(doc.data);
  //       this.router.navigate(['/pages/home']);
  //       swal.fire("USER LOGIN", 'Welcome ' + doc.data.user.firstName + ' ' + doc.data.user.lastName, 'info');
  //       if (doc.imgUrl != '') { localStorage.ImgUrl = doc.imgUrl; } else { localStorage.ImgUrl = 'assets/imgs/avatar_male.png'; }
  //     }else{
  //       swal.fire("USER LOGIN", "Something went wrong, please try again later", 'info')
  //     }      
  //   }).catch(err => {
  //     if(err.error && err.error.data){
  //       swal.fire("USER LOGIN", err.error.data, "info")
  //     }else{
  //       swal.fire("USER LOGIN", "Something went wrong, please try again later", 'info')
  //     }

  //   })

  // }


  loginUser() {
    swal.fire({
      imageUrl: '../../../../assets/img/logo.png',
      title: 'Signing in! Please wait...',
      customClass: { image: "modalLogo" },
      imageAlt: uni.signInTitle,
      animation: true,
      allowOutsideClick: false,
      timer: 60000,
      onBeforeOpen: () => {
        swal.showLoading();
      }
    });
    let model = {
      xMobile: '+234' + this.xForm.value.mobile.substring(1),
      xPin: this.xForm.value.password,
      scheme: uni.scheme
    };
    this.seedService.login(model).then(doc => {
      if (doc.status === true && doc.message === 'user logged in successfully') {
        const { imgUrl, fName, sName } = doc.data;
        localStorage.LogonDate = JSON.stringify(Date.now());
        localStorage.BaseUser = JSON.stringify(doc.data);
        if (imgUrl != '') { localStorage.ImgUrl = doc.imgUrl; } else { localStorage.ImgUrl = 'assets/imgs/avatar_male.png'; }
        this.router.navigate(['/pages/home'])
        swal.fire("USER LOGIN", `Welcome ${fName} ${sName}`, "success")
      } else if (doc.status === false && doc.message === 'user not found') {
        swal.fire("USER LOGIN", `${doc.message}`, "info")
      }
    }).catch(err => {
      console.log(err, 'error')
      swal.fire("USER LOGIN", `${err.error.message || 'Something went wrong, please contact support'} `, "info")
    })
  }









  // signUp(){
  //   this.router.navigate(['/pages/register'])
  // }
  forgotPassword() {
    // this.router.navigate(['/pages/forgotpassword'])
  }


}
