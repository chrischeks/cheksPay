import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router  } from '@angular/router';
import {SeedService} from '../../../../providers/seed.service';
import swal from 'sweetalert2';
// import {Card} from '../../../models/card.model'

@Component({
  selector: 'app-register-cards',
  templateUrl: './register-cards.component.html',
  styleUrls: ['./register-cards.component.scss']
})
export class RegisterCardsComponent implements OnInit {
  xForm: FormGroup;isVerified:boolean;false;canSave:boolean=false;hasBank:boolean=false;canProceed:boolean=false;isTypeAccount=true;
  bankCode:string='';accountName:string='';regType:string='';bu:any;
  bankSelect:Array<any>=[];
  constructor(private router:Router,public formBuilder: FormBuilder,private seedService:SeedService) {
  //   let _bu={
  //     _id: "5d7fc15679b6696045a50735",
  //     fName: "Templar",
  //     sName: "Idigbe",
  //     mobile: "+2348098367527",
  //     bvn: "22291346371",
  //     sex: "Male",
  //     qrCode: "IGKYDU",
  //     imgUrl: "assets/imgs/avatar_male.png",
  //     regDate: 1568653654494,
  //     regDatex: "16 09 2019, 18:07:34",
  //     isVisible: true,
  //     isActive: true,
  //     isSynced: true,
  //     mobileVerified: true,
  //     referralCode: "root",
  //     xroles: [
  //         "User"
  //     ],
  //     xPin: "c4fd7c9e4a5ba93e09b260127f07cdeb",
  //     createdBy: "self",
  //     referrer: [],
  //     cards: [
  //         {
  //             authorization_code: "AUTH_ex22d812kd",
  //             bin: "539941",
  //             last4: "2703",
  //             exp_month: "12",
  //             exp_year: "22",
  //             channel: "card",
  //             card_type: "mastercard DEBIT",
  //             bank: "Zenith Bank",
  //             country_code: "NG",
  //             brand: "mastercard"
  //         }
  //     ],
  //     accounts: [
  //         {
  //             account_no: "2086387251",
  //             bank_code: "057",
  //             bank_name: "Zenith Bank"
  //         }
  //     ]
  // };
    // localStorage.BaseUser=JSON.stringify(_bu);
    if(localStorage.BaseUser!='')
    {
      this.bu=JSON.parse(localStorage.BaseUser);
    }

  this.xForm = this.formBuilder.group({  
    
    dd_bank: new FormControl(''),
    acc_no: new FormControl('', Validators.compose([Validators.required,Validators.maxLength(10),Validators.minLength(10)])),
    card_no: new FormControl('', Validators.compose([Validators.required,Validators.maxLength(19),Validators.minLength(16)])),
    exp_month: new FormControl('', Validators.compose([Validators.required,Validators.maxLength(2),Validators.minLength(2)])),
    exp_year: new FormControl('', Validators.compose([Validators.required,Validators.maxLength(2),Validators.minLength(2)])),
    cvv:new FormControl('', Validators.compose([Validators.required,Validators.maxLength(13),Validators.minLength(3)])),
    typeRadio: new FormControl('Account'),
    checkAgree:new FormControl()
  }); 

  this.seedService.getAllBanks().then(banks=>{
    swal.fire({
      title: 'Getting banks! Please wait...',
      imageUrl: '../../../assets/img/logo.png',
      customClass:{image:'logoModal'},
      imageAlt: '',
      animation: true,
      allowOutsideClick:false,
      timer:10000
    });
    swal.showLoading();
    for (var i=0;i<banks.length;i++)
    {
      let bk={value:banks[i].code,label:banks[i].name};
      this.bankSelect.push(bk);
    }
   this.hasBank=true;
   swal.getTitle().textContent = 'Banks Loaded!'; swal.hideLoading();
  });
   }

  ngOnInit() {
    this.xForm.get('dd_bank').valueChanges.subscribe( (value) => {
      // console.log('Selected value:', value);
      this.bankCode=value;
    });
  }
  checkType(val){
    this.regType=val;
    console.log('regType val: '+val);
    if(val=='Account'){this.isTypeAccount=true;}else {this.isTypeAccount=false;}
  }
  getAllBanks(){
    this.seedService.getAllBanks().then(banks=>{
      // console.log('Banks: '+JSON.stringify(banks))
      console.log('Bank: '+JSON.stringify(banks[0].code));

      for (var i=0;i<banks.length;i++)
      {
        let bk={value:banks[i].code,label:banks[i].name};
        this.bankSelect.push(bk);
      }
     
    });
  }
  
  verifyAccountDetails(){
    swal.fire({
      title: 'Resolving account! Please wait...',
      imageUrl: '../../../assets/img/logo.png',
      customClass:{image:'logoModal'},
      imageAlt: 'Futurewave',
      animation: true,
      allowOutsideClick:false,
      timer:10000
    });
    swal.showLoading();
      let model={
        account_number:this.xForm.value.acc_no,
        bank_code:this.bankCode
        }
      this.seedService.resolveaccount(model).then(details=>{
        console.log('Resolved Details:', details);
        this.accountName=details.data.account_name;
        this.isVerified=true;
        swal.getTitle().textContent = 'Account verified!'; swal.hideLoading();
      }) 
  }
  backToVerifyDetails(){
    this.isVerified=false;
  }
  proceedToCardDetails(){
      this.canSave=true;
  }
  saveAccount(){
    swal.fire({
      title: 'Adding account! Please wait...',
      imageUrl: '../../../assets/img/logo.png',
      customClass:{image:'logoModal'},
      imageAlt: '',
      animation: true,
      allowOutsideClick:false,
      timer:10000
    });
    swal.showLoading();
    let bank_name='';
    for(var i=0;i<this.bankSelect.length;i++)
    {
      if(this.bankSelect[i].value==this.bankCode){bank_name=this.bankSelect[i].label}
    }
    let model={
      xid: this.bu._id,
      account_no: this.xForm.value.acc_no,
      bank_code: this.bankCode,
      bank_name: bank_name
    }
    console.log('Account Model:', JSON.stringify(model));
    this.seedService.addBankAccount(model).then(result=>{
      console.log('Acc Account Result:', JSON.stringify(result));
      localStorage.BaseUser=JSON.stringify(result);
      this.router.navigate(['/pages/home'])
      swal.getTitle().textContent = 'Account added!'; swal.hideLoading();
    })
      
  }
  saveCard(){
    let model={
      xid: this.xForm.value.exp_month,
      authorization_code: '',
      bin: this.xForm.value.exp_month,
      last4: this.xForm.value.exp_month,
      exp_month: this.xForm.value.exp_month,
      exp_year: this.xForm.value.exp_month,
      channel: 'card',
      card_type: this.xForm.value.exp_month,
      bank: this.xForm.value.exp_month,
      country_code: this.xForm.value.exp_month,
      brand: this.xForm.value.exp_month,
      createdAt: this.xForm.value.exp_month,
      xCreatedAt: this.xForm.value.exp_month,
    }
      
  }
}
