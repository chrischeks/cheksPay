import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as uni from '../../../../globals/universal';
import { SeedService } from '../../../../providers/seed.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  baseUser: any;
  bu: any;
  imageLoading: boolean = true;
  timeStamp: any;
  showBvn: boolean = false;
  isHome = this.route.snapshot.queryParamMap.get('home');
  bvnForm: FormGroup;
  // 22269878994
  constructor(private seedService: SeedService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm()
    if (localStorage.BaseUser) {
      this.bu = JSON.parse(localStorage.BaseUser);
    }
    console.log(this.bu, 'ppppp');


    // this.baseUser = JSON.parse(localStorage.BaseUser)
  }

  initForm() {
    this.bvnForm = new FormGroup({
      x: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')])
    })
  }

  toggleShowBvn() {
    this.showBvn = !this.showBvn;
  }

  clickFileButton(btnId) {
    document.getElementById(btnId).click()
  }


  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }


  resolveBvn() {
    swal.fire({
      title: 'BVN VERIFICATION',
      text: 'Your bvn is being verified, please wait...',
      timer: 120000,
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading();
      }
    })
    // {status: false, message: "Unable to resolve BVN"}
    // {status: true, message: "BVN resolved", data: {…}, meta: {…}}status: truemessage: "BVN resolved"data: {first_name: "SAMUEL", last_name: "LAWAL", dob: "11-Dec-94", formatted_dob: "1994-12-11", mobile: "09035140008", …}
    this.seedService.resolvebvn(this.bvnForm.value)
      .then(res => {
        if (res.status === true ) {
          if(this.bu.fName.toLowerCase() == res.data.first_name.toLowerCase() && this.bu.sName.toLowerCase() == res.data.last_name.toLowerCase()){
            this.bu['bvn'] = this.bvnForm.value.x;
            this.seedService.updateBvn(this.bu)
              .then(result => {
                if(result.bvn !== ''){
                  swal.fire('UPDATE BVN', 'BVN updated', 'success');
                  this.toggleShowBvn()
                  localStorage.BaseUser = JSON.stringify(this.bu);
                }else{
                  swal.fire('UPDATE BVN', 'Something went wrong, try again later', 'info')
                }
              })
          }else{
            swal.fire('BVN VERIFICATION', 'Profile name did not match name on bvn', 'info')
          }
          
        }else{
          swal.fire('BVN VERIFICATION', 'Unable to resolve BVN', 'info')
        }

       
        // console.log(res, 'ooooo');
        // swal.close()
      })
  }

  onImageLoad() {
    this.imageLoading = false
    console.log(12345);

    // Do what you need in here
  }


  saveImage(key) {
    swal.showLoading()
    // let PassportPhotograph={isAvailable:false,url:""}
    // if(this.bu.requirements){
    //   if(!this.bu.requirements.PassportPhotograph){
    //     this.bu.requirements["PassportPhotograph"]=PassportPhotograph;
    //   }
    // }
    console.log('saveImage Bu :' + JSON.stringify(this.bu))
    let model = {
      key: this.bu._id + '_' + key,
      imageData: this.croppedImage,
      bucket: uni.bucket
    }
    this.seedService.uploadPassport(model).then(res => {
      this.bu["requirements"] = { PassportPhotograph: { isAvailable: true, url: res.Location } }
      this.bu.imgUrl = res.Location;
      this.timeStamp = Date.now();
      this.seedService.updateUserImage(this.bu).then(() => {
        localStorage.BaseUser = JSON.stringify(this.bu);
        this.croppedImage = '';
        this.imageChangedEvent = '';
        swal.fire('Passport Upload', "The upload was successful", 'success')
      }).catch(() => {
        swal.fire('Passport Upload', "Failed to upload passport, try again later", 'error')
      })

    });

  }
}
