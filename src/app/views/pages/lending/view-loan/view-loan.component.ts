import { Component, OnInit, ViewChild } from '@angular/core';
import { SeedService } from '../../../../providers/seed.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as uni from '../../../../globals/universal'
import swal from 'sweetalert2';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { UploadsService } from '../../../../providers/upload.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-loan',
  templateUrl: './view-loan.component.html',
  styleUrls: ['./view-loan.component.scss']
})
export class ViewLoanComponent implements OnInit {
  loanDetails: any;
  coyApp = uni.scheme_full;
  coymCashCode: string = "";
  monthAmountPayable: number = 0;
  @ViewChild("payBackModal", {static:true}) payBackModal: ModalDirective;
  requirements = new Array();
  completeDoc: boolean = true;
  base64String: any = '';
  selected: File;
  selectedReq = '';
  bu = JSON.parse(localStorage.BaseUser);

  constructor(
    private seedService: SeedService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadsService,
    private cp: CurrencyPipe) { }

  ngOnInit() {
    this.getLoan()
  }

  getLoan() {
    this.route.data
      .subscribe((data: any) => {
        this.loanDetails = data.loan[0]
        this.checkRequirements()
      })
  }

  checkRequirements() {
    if (!this.loanDetails.requirements) {
      this.requirements = this.loanDetails.offer.requirements
      this.requirements = uni.checkRequirements(this.requirements)
      for (let req of this.requirements) {
        req.url = "";
      }
    } else {
      this.requirements = this.loanDetails.requirements;
    }

    for (let req of this.requirements) {
      if (req.url === "") {
        this.focusOnRequirement()
        this.completeDoc = false;
        return
      }
    }

  }

  payBack() {
    this.monthAmountPayable = this.loanDetails.details[0].monthlyRepayments / 100;
    this.coymCashCode = uni.coymCashCode + this.monthAmountPayable + "#";

    this.payBackModal.show()
  }



  confirmLoanRepayAmount() {
    swal.fire({
      title: "PAY BACK LOAN",
      html: `<b>Amount Payable: </b>${this.cp.transform(this.monthAmountPayable, 'NGN', 'symbol-narrow')} `,
      imageUrl: '../../../../assets/img/logo.png',
      customClass:{image:'logoModal'},
      imageAlt: uni.scheme,
      animation: true,
      showCancelButton: true
    }).then(res => {
      if (res.value) {
        this.router.navigate(["/pages/pay-loan/card", this.loanDetails._id])
      }
    })
  }


  loanUpload() {
    swal.fire({
      title: 'REQUIREMENT UPLOAD',
      text: 'Please wait while we upload your document...',
      timer: 100000,
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    // swal.showLoading();
    let key = this.selectedReq;
    if (key) {
      let model = {
        key: this.bu._id + '_' + key,
        imageData: this.base64String,
        bucket: uni.bucket
      }
      this.uploadService.uploadDocuments(model)
        .then(res => {
          if (res.Location) {
            this.requirements.map(data => {
              if (data.value === key) {
                data.url = res.Location
              }
            })
            this.requirements[this.requirements.length - 1]
            //get the loan Id from the loan response
            this.updateLoansRequirement(this.loanDetails._id, this.requirements)

          } else {
            swal.fire("REQUIREMENT UPLOAD", "File upload failed", 'info');
          }

        })
        .catch(err => {
          swal.fire("REQUIREMENT UPLOAD", "An error occurred", 'error')
        })
    } else {
      swal.fire("REQUIREMENT UPLOAD", "Please select the document you want to upload", 'info')
    }
  }



  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  async onFileChanged(event: any) {
    this.selected = event.target.files[0];

    this.getBase64(this.selected)
      .then(data => {
        this.base64String = data
      });
  }

  selectedRequirement(req) {
    this.selectedReq = req

    //This below is needed if the requirements are not just file upload
    if (req === "SalaryAccountDetails" || req === "PensionAccount") {
      // this.account = true
    } else if (req === "ApplicantGuarantor") {
      // this.guarantor = true
    }

  }



  updateLoansRequirement(loanId, requirements) {
    const model = {
      _id: loanId,
      requirements
    }
    this.seedService.updateLoanRequirement(model)
      .then(res => {
        if (res) {
          swal.fire('REQUIREMENT UPLOAD', 'Document Uploaded', 'success');
        } else {
          swal.fire("REQUIREMENT UPLOAD", "File upload failed", 'info');
        }

      })
  }

  async checkCompletedRequirements(requirements) {
    let complete = true
    for (let req of requirements) {
      if (req.url === '') {
        return complete = false
      }
    }
    return complete
  }


  finishLoanUploads() {
    this.checkCompletedRequirements(this.requirements)
      .then(res => {
        if (res === true) {
          swal.fire('DOCUMENT UPLOAD', 'Your documents have been sent', 'success');
          this.completeDoc = true
        } else {
          swal.fire('DOCUMENT UPLOAD', 'Upload all requested documents', 'info')
        }
      })
  }

  focusOnRequirement() {
    const requirements = document.getElementById('requirements');
    requirements.style.display = '';
    requirements.scrollIntoView();
  }

}
