import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SeedService } from '../../../../providers/seed.service';
import * as uni from '../../../../globals/universal';
import swal from 'sweetalert2';


@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss']
})
export class ReferAFriendComponent implements OnInit {
  referralForm: FormGroup;
  bu: any
  constructor(private seedService: SeedService) { 
    this.bu=JSON.parse(localStorage.BaseUser);
  }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.referralForm = new FormGroup({
      phone: new FormControl('', [Validators.pattern('^[0-9]{11}$'), Validators.required]),
    });
  }


  onSubmit(){
    swal.fire({
      title: "REFER A FRIEND",
      text: 'Sending request, please wait...',
      timer: 100000,
      onBeforeOpen:()=>{
        swal.showLoading()
      }
    })
    let model={
      "to":'+234'+this.referralForm.value.phone,
      "from":uni.scheme,
      "text":"Your friend "+this.bu.fName+' '+this.bu.sName+" has invited you to use '"+uni.scheme+"'.\nPlease http://spectrum.rubikpay.tech/ and start earning!!\nRegards, The "+uni.scheme+" Team"
      };
      this.seedService.sendSMS(model)
      .then(msg=>{
        this.referralForm.reset();
          swal.fire('REFERRAL REQUEST!','YOUR REQUEST WAS SENT SUCCESSFULLY','success')
        // if(msg.messages[0].status.name && msg.messages[0].status.name == 'REJECTED_NOT_ENOUGH_CREDITS'){
        //   swal.fire('REFER A FRIEND', 'Sorry, an error occurred please try again later', 'info')
        // }else{
          
        // }
        
      }).catch(err=>{
        swal.fire('REFER A FRIEND', 'Sorry, an error occurred please try again later', 'info')
        
      })
      
    }

}
