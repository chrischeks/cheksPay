import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeedService } from '../../../providers/seed.service';
import * as uni from '../../../globals/universal';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  full_name: string = ''; mobile: string = ''; xpin: string = ''; first_name: string = ''; last_name: string = ''; checkAgree: any
  isAgreed: boolean = false;
  text: "";
  validform: boolean = false;
  email: string = ''
  dob: Date;
  sex: string = ''
  male = 'male';
  female = 'female'
  others = 'others';
  registerForm: FormGroup;
  showPassword: boolean = false;
  inputType: string = 'text'

  constructor(private router: Router, private seedService: SeedService) {
    this.createForm()
  }
  createForm() {
    this.registerForm = new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      xMobile: new FormControl("", Validators.pattern('^[0-9]{11}$')),
      email: new FormControl("", [Validators.required, Validators.email]),
      xPin: new FormControl("", [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),
      dob: new FormControl("", [Validators.required, CustomValidators.date]),
      referralCode: new FormControl(''),
      createdBy: new FormControl("self"),
      xroles: new FormControl(["User", "Admin", "Super Admin"]),
      imgUrl: new FormControl("assets/imgs/avatar_male.png"),
      channel: new FormControl('web'),
      bvn: new FormControl(""),
      fName: new FormControl(""),
      sName: new FormControl(""),
      sex: new FormControl(""),
      scheme: new FormControl(uni.scheme)
    });
  }

  checkAgreed() {
    if (this.isAgreed) {
      this.isAgreed = false;
    } else { this.isAgreed = true; }
  }
  ngOnInit() {
  }
  loginPage() {
    this.router.navigate(['/login'])
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPassword? this.inputType = "password":this.inputType = "text"
  }


  signUp() {
    this.registerForm.value.fName = this.registerForm.value.fullName.trim().split(/[\s,]+/)[0];
    this.registerForm.value.sName = this.registerForm.value.fullName.trim().split(/[\s,]+/)[1];
    this.registerForm.value.sex = this.sex;
    this.registerForm.value.xMobile = `+234${this.registerForm.value.xMobile.substring(1)}`
    swal.fire({
      title: 'Registering you! Please wait...',
      imageUrl: '../../../assets/img/logo.png',
      customClass: { image: 'modalLogo' },
      imageAlt: uni.scheme,
      animation: true,
      allowOutsideClick: false,
      timer: 20000,
      onBeforeOpen: () => {
        swal.showLoading();
      }
    });
    this.seedService.registerUser(this.registerForm.value).then(res => {
      if (res[0]._id) {
        this.router.navigate(['/login']);
        swal.fire('All Done!', 'YOUR REGISTRATION HAS BEEN COMPLETED SUCCESSFULLY', 'success');
        let model = {
          "to": '+234' + this.mobile.substring(1),
          "from": uni.scheme,
          "text": "Hello " + this.first_name + "\nYour registration has been completed successfully.\nWelcome to " + uni.scheme
        };
        this.seedService.sendSMS(model).then(msg => { })
      }
    }).catch(err => {
      if (err.error.text === "User Exists!!") {
        swal.fire('Register', "User Already exists", "info")
      }
    });
  }
}
