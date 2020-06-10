import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import {SeedService} from '../../../../providers/seed.service';
import   * as uni from '../../../../globals/universal';
import { IMyOptions } from 'ng-uikit-pro-standard';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
export class NewAccountComponent implements OnInit {
  bu:any;new_account:any;data: any;
  maritalStatusSelect:Array<any>=[]; genderSelect:Array<any>=[];stateSelect:Array<any>=[]; titleSelect:Array<any>=[];empStatusSelect:Array<any>=[];nokRelationshipSelect:Array<any>=[];

  p_infoBvn:any='';p_infoTitle:any='';p_infoGender:any='';p_infoFName:any='';p_infoSName:any='';p_infoOName:any='';p_infoDOB:any='';p_infoMaritalStatus:any='';
  
  address_infoHouseNo:any='';address_infoZip:any=''; address_infoStreet:any='';address_infoLandmark:any=''; address_infoCity:any='';address_infoState:any=''; address_infoMobile:any='';address_infoEmail:any=''; 
  
  emp_infoStatus:any='';emp_infoState:any=''; emp_infoDOB:any='';emp_infoBizAddress:any='';emp_infoBizname:any='';
  emp_infoOccupation:any='';
  
  nok_infoTitle:any=''; nok_infoGender:any='';nok_infoFName:any=''; nok_infoSName:any=''; nok_infoOName:any='';nok_infoDOB:any=''; nok_infoMaritalStatus:any=''; nok_infoHouseNo:any;nok_infoZip:any=''; nok_infoStreet:any=''; nok_infoLandmark:any='';nok_infoCity:any=''; nok_infoState:any=''; nok_infoMobile:any='';nok_infoEmail:any='';nok_infoRelationship:any='';
isValidInfo:boolean=false;isValidAddress:boolean=false;isValidNok:boolean=false;isValidEmp:boolean=false;

  constructor(private router:Router,private seedService:SeedService) {
    if(localStorage.BaseUser){
      this.bu=JSON.parse(localStorage.BaseUser);}
    if(this.bu.customerDetails){
      this.router.navigate(['/pages/home']);
      swal.fire('ACCOUNT CREATION!','YOU ALREADY HAVE AN EXISTING ACCOUNT!','error')
    }
    else{
      this.bu=JSON.parse(localStorage.BaseUser);
      this.p_infoFName=this.bu.fName;this.p_infoSName=this.bu.sName;this.address_infoMobile=this.bu.mobile;
    }
    
   }
  public myDatePickerOptions: IMyOptions = {
    minYear: 1920,
    dateFormat: 'yyyy-mm-dd'
    };
  ngOnInit() {
    this.maritalStatusSelect=[
      {value:'Divorced',label:'Divorced'},
      {value:'Married',label:'Married'},
      {value:'Single',label:'Single'},
      {value:'Separated',label:'Separated'},
      {value:'Others',label:'Others'}
    ];
    this.titleSelect=[
      {value:'Mr',label:'Mr'},
      {value:'Mrs',label:'Mrs'},
      {value:'Ms',label:'Ms'}
    ];
    this.genderSelect=[
      {value:'Male',label:'Male'},
      {value:'Female',label:'Female'}
    ];
    this.stateSelect=[
      {value:'1',label:'Kano'},
      {value:'2',label:'Lagos'},
      {value:'3',label:'Kaduna'},
      {value:'4',label:'katsina'},
      {value:'5',label:'Oyo'},
      {value:'6',label:'Rivers'},
      {value:'7',label:'Bauchi'},
      {value:'8',label:'Jigawa'},
      {value:'9',label:'Benue'},
      {value:'10',label:'Anambra'},
      {value:'11',label:'Borno'},
      {value:'12',label:'Delta'},
      {value:'13',label:'Niger'},
      {value:'14',label:'Imo'},
      {value:'15',label:'Akwa Ibom'},
      {value:'17',label:'Ogun'},
      {value:'18',label:'Sokoto'},
      {value:'19',label:'Ondo'},
      {value:'20',label:'Osun'},
      {value:'21',label:'kogi'},
      {value:'22',label:'Zamfara'},
      {value:'23',label:'Enugu'},
      {value:'24',label:'Kebbi'},
      {value:'25',label:'Edo'},
      {value:'26',label:'Plateau'},
      {value:'27',label:'Adamawa'},
      {value:'28',label:'Cross Rivers'},
      {value:'30',label:'Abia'},
      {value:'31',label:'Ekiti'},
      {value:'32',label:'Kwara'},
      {value:'33',label:'Gombe'},
      {value:'34',label:'Yobe'},
      {value:'35',label:'Taraba'},
      {value:'36',label:'Ebonyi'},
      {value:'37',label:'Nasarawa'},
      {value:'38',label:'Bayelsa'},
      {value:'39',label:'FCT'},
      {value:'40',label:'Other'}
    ];
    this.stateSelect.sort(this.compare);
    this.empStatusSelect=[
      {value:'Employed',label:'Employed'},
      {value:'Self-Employed',label:'Self-Employed'},
      {value:'Unemployed',label:'Unemployed'},
      {value:'Retired',label:'Retired'},
      {value:'Student',label:'Student'}
    ];
    this.nokRelationshipSelect=[
      {value:'Aunt',label:'Aunt'},
      {value:'Brother',label:'Brother'},
      {value:'Cousin',label:'Cousin'},
      {value:'Daugther',label:'Daugther'},
      {value:'Father',label:'Father'},
      {value:'Husband',label:'Husband'},
      {value:'Mother',label:'Mother'},
      {value:'Nephew',label:'Nephew'},
      {value:'Niece',label:'Niece'},
      {value:'Sister',label:'Sister'},
      {value:'Son',label:'Son'},
      {value:'Uncle',label:'Uncle'},
      {value:'Wife',label:'Wife'}
    ];
  }

  validInfo(){
    if((this.p_infoBvn!='')&&(this.p_infoTitle!='')&&(this.p_infoGender!='')&&(this.p_infoFName!='')&&(this.p_infoSName!='')&&(this.p_infoMaritalStatus!='')
      ){return true;}
    else{return false;}
  }
  validAddress(){
    if((this.address_infoHouseNo!='')&&(this.address_infoZip!='')&&(this.address_infoStreet!='')&&(this.address_infoLandmark!='')&&(this.address_infoCity!='')&&
    (this.address_infoState!='')&&(this.address_infoMobile!='')&&(this.address_infoEmail!='')&&(this.p_infoSName!='')&&(this.p_infoMaritalStatus!='')&&
    (this.p_infoTitle!='')&&(this.p_infoGender!='')&&(this.p_infoFName!='')&&(this.p_infoSName!='')&&(this.p_infoMaritalStatus!='')
  ){return true;}
else{return false;}
  }
  validNok(){
    if((this.nok_infoTitle!='')&&(this.nok_infoGender!='')&&(this.nok_infoFName!='')&&(this.nok_infoSName!='')&&(this.nok_infoOName!='')&&
    (this.nok_infoDOB!='')&&(this.nok_infoMaritalStatus!='')&&(this.nok_infoHouseNo!='')&&(this.nok_infoZip!='')&&(this.nok_infoStreet!='')&&
    (this.nok_infoLandmark!='')&&(this.nok_infoCity!='')&&(this.nok_infoState!='')&&(this.nok_infoMobile!='')&&(this.nok_infoEmail!='')
  ){return true;}
else{return false;}
  }

  toAddress(){
    if(this.validInfo()){this.isValidInfo=true;}
    else{swal.fire('PERSONAL INFORMATION!','PLEASE FILL IN ALL THE DETAILS!','warning')}
  }
  backToinfo(){
    this.isValidInfo=false;
  }
  toNok(){
    if(this.validAddress()){this.isValidAddress=true;}
    else{swal.fire('ADDRESS!','PLEASE FILL IN ALL THE DETAILS!','warning')}
  }
  backToAddress(){
    this.isValidInfo=true;this.isValidAddress=false;
  }
  toEmp(){
    if(this.validNok()){this.isValidNok=true;}
    else{swal.fire('NEXT OF KIN!','PLEASE FILL IN ALL THE DETAILS!','warning')}
  }
  backToNok(){
    this.isValidAddress=true;this.isValidNok=false;
  }
  createAccount(){
    if((this.validInfo())&&(this.validInfo())&&(this.validNok())){
      swal.fire({
        title: 'Creating Account! Please wait...',
        imageUrl: '../../../assets/img/logo.png',
        customClass: { image: 'modalLogo' },
        imageAlt: 'Futurewave',
        animation: true,
        allowOutsideClick:false,
        timer:25000
      });
      var customer={
        "xMobile":this.bu.mobile,
        "scheme":uni.scheme,
        "CustomerId":0,
        "Salutation": this.p_infoTitle,
        "FirstName": this.p_infoFName,
        "MiddleName":  this.p_infoOName,
        "LastName": this.p_infoSName,
        "MotherMaidenName":'',
        "DateOfBirth":this.p_infoDOB,
        "Occupation": this.emp_infoOccupation,
        "HomeTelephone": this.address_infoMobile.replace('+234',''),
        "MobileTelephone":this.address_infoMobile.replace('+234',''),
        "WorkTelephone": this.address_infoMobile.replace('+234',''),
        "Gender":this.p_infoGender,
        "NameOfSpouse":  this.nok_infoFName+' '+this.nok_infoSName,
        "NameOfNextOfKin":  this.nok_infoFName+' '+this.nok_infoSName,
        "EmailAddress":  this.address_infoEmail,
        "NameOfCurrentEmployer":  this.emp_infoBizname,
        "AddressOfCurrentEmployer":  this.emp_infoBizAddress,
        "Relationship":  this.nok_infoRelationship,
        "PoBox": this.address_infoZip,
        "Street":this.address_infoStreet,
        "City":this.address_infoCity,
        "StateID": this.address_infoState,
        "ZipCode": this.address_infoZip,
        "CustomerSince": moment(Date.now()).format('YYYY-MM-DD')+"T00:00:00.6648604+01:00",
        "Comments":'New Customer from RubikPay Limited',
        "HomeBranch": '3',
        "IdNumber": '',
        "Bvn":this.p_infoBvn
        }
        console.log('Customer: '+JSON.stringify(customer))
        this.seedService.registerSpectrumAccount(customer).then(payload=>{
          localStorage.BaseUser=JSON.stringify(payload);
          let model={
            "to":this.bu.mobile,
            "from":uni.scheme,
            "text":"Your account creation has been completed successfully with Customer ID: "+payload.customerDetails.CustomerId+" and Account No: "+this.bu.mobile.replace('+234','')+".\nThe "+uni.scheme+ "Team."
            };
          this.seedService.sendSMS(model).then(msg=>{
            swal.hideLoading(); this.router.navigate(['/pages/home']);
          swal.fire('DONE!','YOUR ACCOUNT HAS BEEN CREATED SUCCESSFULLY','success')
          })
        })
    }
    else{
      swal.fire('ACCOUNT ERROR!','PLEASE FILL IN ALL THE FIELDS','warning')
    }
  }

  compare( a, b ) {
    if ( a.label < b.label ){
      return -1;
    }
    if ( a.label > b.label ){
      return 1;
    }
    return 0;
  }


}
