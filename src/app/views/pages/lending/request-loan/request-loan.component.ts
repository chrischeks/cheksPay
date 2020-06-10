import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeedService } from '../../../../providers/seed.service';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as uni from '../../../../globals/universal';
import { CustomValidators } from 'ngx-custom-validators';
import * as moment from 'moment';
import { checkRequirements } from '../../../../globals/universal';
import { UploadsService } from '../../../../providers/upload.service';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-request-loan',
  templateUrl: './request-loan.component.html',
  styleUrls: ['./request-loan.component.scss']
})
export class RequestLoanComponent implements OnInit {
  isVerified: boolean; false; canSave: boolean = false; canProceed: boolean = false;
  AccountDetails: string = '';
  bu: any;
  loanOffers: Array<any> = [];
  mainLoanOffers: Array<any> = [];
  offer: any;
  tenure: string = '';
  amountOffered: string = '';
  showForm: boolean = false;
  requestForm: FormGroup;
  lt_account_cards: any = new Array();
  lt_loan_history = new Array();
  canRequestLoan: boolean = false;
  loans_history: any;
  lt_loanOffers: any = new Array();
  loanScore: any;
  // amt: number = 0;
  tenor: number = 0;
  interest: number = 0;
  loanMin: number = 0;
  loanMax: number = 0;
  LoanOffers: string = '';
  description: string = '';
  tenorMin: number = 0;
  tenorMax: number = 0;
  tenorSteps: number = 30;
  amountPayable: number = 0;
  amountPayableCharge: number = 0;
  showAccount: boolean = false;
  isSelected: boolean = false;
  selectedCard: any = null;
  isCardSelected: boolean = false;
  disburseAccountName: string = '';
  disburseAccountCode: string = '';
  disburseAccountNo: string = '';
  disburseAccountNoMask: string = '';
  canSubmit: boolean = false;
  gettingLoans = false;
  userModel: any;
  showLoanDetails: boolean = false;
  status: string
  isMenu
  showOffer: boolean = false;
  title: string = '';
  requirements: any;
  reqTitle: string = '';
  account: boolean = false;
  base64String: any = '';
  selected: File;
  selectedLoanId: string = ''
  uploadView: boolean = false;
  isLoading: boolean = false;
  coymCashCode: string = "";
  coy: string = uni.coy;
  coyApp = uni.scheme_full;
  repayAmount: any;
  returningBorrower: boolean = false;
  choosenOffer: any;
  loanId: string;
  loanMinFormattedAmt
  paymentOffer;
  tenorInMonths: number = 1;
  monthlyRepayments: number = 0;
  totalMonthlyInstallments: number = 0;
  amountPayableNGN: number = 0;
  disburseAmtNGN: number = 0;
  interestNGN: number = 0;
  disableTenor: boolean = false;
  tenorDisplay = new Array();
  guarantor: boolean = false;
  selectedReq = '';




  constructor(
    private router: Router,
    private seedService: SeedService,
    private uploadService: UploadsService,
    private cp: CurrencyPipe) {
    if (localStorage.BaseUser != '') {
      this.bu = JSON.parse(localStorage.BaseUser);
      if (this.bu.account_cards) {
        let accountCards = this.bu.account_cards
        for (var i = 0; i < accountCards.length; i++) {
          accountCards[i]["isSelected"] = false;
        }
        // this.lt_account_cards = accountCards; 
        // this.cards_count = this.cards.length;
        this.lt_account_cards = accountCards;
      }
    }
    // this.loans_history = "history";
  }


  selectCard(x) {
    for (var i = 0; i < this.lt_account_cards.length; i++) {
      this.lt_account_cards[i].isSelected = false;
    }
    this.selectedCard = x;
    x.isSelected = true;
    this.isCardSelected = true;
  }

  saveDisbursementAccount() {
    this.disburseAccountCode = this.selectedCard.bank_code;
    this.disburseAccountName = this.selectedCard.bank;
    this.disburseAccountNo = this.selectedCard.account_no;
    this.disburseAccountNoMask = uni.maskAccountNumber(this.disburseAccountNo)
    this.canSubmit = true;
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






  requestLoan() {
    this.isLoading = true;
    swal.fire({
      title: 'REQUEST LOAN',
      text: 'Please wait while we process your information...',
      timer: 600000,
      type: 'info',
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })

    //   // console.log('(localStorage.Offers: '+localStorage.Offers);
    const model = {

      offer: this.choosenOffer,
      amount: this.requestForm.value.amount * 100,
      transaction_desc: "Loan advice for " + uni.scheme,
      customer_ref: this.bu.mobile.substring(1),
      firstname: this.bu.fName,
      surname: this.bu.sName,
      email: this.bu.email,
      mobile_no: this.bu.mobile.substring(1),
      scheme: uni.scheme,
      xid: this.bu._id,
      userFullname: this.bu.fName + ' ' + this.bu.sName,
      userMobile: this.bu.mobile,
      userEmail: this.bu.userEmail,
      userCode: this.bu.qrCode,
      isOverdue: false,
      hasPaid: false,
      status: "Pending",
      principal: this.requestForm.value.amount * 100,
      interest: this.amountPayable * 100,
      duration: this.requestForm.value.tenor,
      perc: this.interest,
      dueDate: "",
      elapsedSn: "0",
      account_name: this.disburseAccountName,
      account_code: this.disburseAccountCode,
      account_no: this.disburseAccountNo,
    };


    // this.seedService.registerLoanAllDataSpectrum(model).then(requestLoan => {
    this.seedService.disburseLoanWithFullData(model).then(requestLoan => {

      var model = {
        "from": uni.scheme,
        "to": this.bu.mobile,
        // "to":"+2348034654797",
        "text": "Your loan request has been received. We will vet and disburse shortly" + "\r\n" +
          'Thank you for using ' + uni.scheme + " " + " Loans."
      }
      this.seedService.sendSMS(model).then(sms => {
        console.log(sms, 'bbbbbb');
        
        this.showForm = true
        this.requestForm.reset()
        // this.requirements.length > 0 ? this.uploadView = true : this.uploadView = false;

        this.canSubmit = false;
        this.showAccount = false;
        this.isLoading = false;
        swal.fire('LOAN REQUEST', 'WELL DONE, YOUR LOAN REQUEST WAS SENT SUCCESSFULLY!!', 'success');
        this.finishReset()
      });

    }).catch(err => {
      // console.log(err, 'hhhhhhh');

    });
  }



  toggleUploadView() {
    this.showForm = true
    this.canSubmit = true;
    this.uploadView = !this.uploadView
  }


  toggleCanSubmit() {
    this.canSubmit = !this.canSubmit;
    this.toggleAccount()
  }

  toggleAccount() {
    this.showAccount = !this.showAccount
  }

  toggleCard() {
    this.finishReset()
    // this.showForm = !this.showForm;
    // this.uploadView = !this.uploadView;
    // this.showOffer = !this.showOffer;
    // this.showLoanDetails = !this.showLoanDetails;
    // this.toggleAccount();
  }


  createForm() {
    this.requestForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      tenor: new FormControl('', [Validators.required])
    });
  }

details(){
  for(let loan of this.lt_loan_history){
    if(loan.status === "Disbursed"){
      this.loanDetails(loan)
      return
    }
  }
}

  loanDetails(x) {
    // const model = {
    //   x: x._id,
    //   scheme: uni.scheme
    // }

    console.log('loanDetails: ', x);
    this.status = x.status;
    this.userModel = x;
    this.userModel["disburseDate"] = x.details[0].disburseDate || "Not Available";
    this.userModel["dueDate"] = x.details[0].dueDate || "Not Available";
    this.userModel["repaymentDate"] = x.repaymentDate || "Not Available";
    this.userModel["perc"] = x.details[0].perc;

    if (x.details[0].loan_score) {
      this.userModel["loanStatus"] = x.details[0].loan_score.status;
      this.userModel["confidence"] = x.details[0].loan_score.data.score.confidence;
    }
    else {
      this.userModel["loanStatus"] = "No score returned";
      this.userModel["confidence"] = 0;
    }
    this.showLoanDetails = true;

    this.repayAmount = uni.cal_online_charge(((this.userModel.details[0].interest * 1) / 100)) + 200;
    console.log(this.repayAmount, 'amt');

    let normal_amt = ((this.userModel.details[0].interest * 1) / 100) + 200;
    console.log(normal_amt, 'normal_amt');

    this.coymCashCode = uni.coymCashCode + normal_amt + "#";
    console.log(this.coymCashCode, 'ggggg');

  }


  confirmLoanRepayAmount() {
    swal.fire({
      title: "PAY BACK LOAN",
      html: `<b>Amount Payable: </b>${this.cp.transform(this.repayAmount, 'NGN', 'symbol-narrow')} (Repayment + 1.5% processing charge)`,
      type: 'info',
      animation: true,
      showCancelButton: true
    }).then(res => {
      if (res.value) {
        this.router.navigate(["/pages/pay-loan/card", this.userModel._id])
      }
    })
  }


  toggleShowDetails() {
    this.showLoanDetails = !this.showLoanDetails;
  }


  randomlyAssignedCardColours() {
    let result = '';
    // const colorChars = ['00a85b', '0098db', 'fddb6f', 'eb1f22']
    const colorChars = ['07A4D9']

    result = colorChars[Math.floor(Math.random() * colorChars.length)]
    return `#${result}`;
  }



  loanFlow() {
    this.showLoanDetails = false
    swal.fire({
      title: 'BIZIPAY LOANS',
      type:"info",
      text: 'Fetching loan offers. Please wait...',
      animation: true,
      allowOutsideClick: false,
      timer: 20000,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    });
    if ((this.lt_loan_history) && (this.lt_loan_history.length >= 1)) {
      if (this.lt_loan_history[0].status == "Disbursed") {//Exisiting loan: Show repayment flow!!
        // console.log('You have an exisitng loan!')
        swal.fire('Existing Loan', 'You have an existing loan!', 'warning')
        this.canRequestLoan = false;
        this.loans_history = "history";
      }
      else if (this.lt_loan_history[0].status == "Pending") {//Exisiting request: Do nothing
        // console.log('You have an pending request!')
        swal.fire('Pending Request', 'You have a pending request. Please give us some time!', 'warning')
        this.canRequestLoan = false;
        this.loans_history = "history";
      } else if (this.lt_loan_history[0].status == "Repaid" || this.lt_loan_history[0].status == "Declined") {//Can request loan: Do request flow!!
        //   let loansToAnalyse:any=JSON.parse(localStorage.LoanHistory)
        // console.log('loansToAnalyse: '+JSON.stringify(loansToAnalyse))
        // let scoreLoans=new Array();
        // for(var l=0;l<loansToAnalyse.length;l++){
        //   scoreLoans.push(loansToAnalyse[l].details[0].principal/100)
        // }
        // console.log('scoreLoans: '+JSON.stringify(scoreLoans))
        // let score=uni.calcScore(scoreLoans);console.log('score: '+JSON.stringify(score))
        this.canRequestLoan = true;

        let model = {
          scheme: uni.scheme
        }
        this.seedService.getGenericLoans(model).then(body => {
          console.log('Offesr Body length: ' + body.length)
          this.lt_loanOffers = body;
          if (this.lt_loanOffers.length > 0) {
            this.loadOffers()
          }
          else {
            swal.fire({
              title: '<strong>LOAN OFFERS</strong>',
              type: 'error',
              html: '<h6><b>COULD NOT LOAD OFFERS AT THIS TIME</b></h6>'
            });
          }
        });
      }
    }
    else {// No Loans
      this.canRequestLoan = true;

      let model = {
        scheme: uni.scheme
      }
      this.seedService.getGenericLoans(model).then(body => {
        console.log('Offer Body: ', body); console.log('Offesr Body length: ' + body.length)
        this.lt_loanOffers = body;
        this.lt_loanOffers.sort(uni.compareTitle);
        if (this.lt_loanOffers.length > 0) {
          this.loadOffers()
        }
        else {
          swal.fire({
            title: '<strong>LOAN OFFERS</strong>',
            type: 'error',
            html: '<h6><b>COULD NOT LOAD OFFERS AT THIS TIME</b></h6>'
          });
        }
      });
    }
  }



  loadOffers() {
    for (let offer of this.lt_loanOffers) {
      offer.color = this.randomlyAssignedCardColours();
      offer.loanAmtTo = offer.loanAmtTo / 100;
      offer.loanAmtFrom = offer.loanAmtFrom / 100;
      offer.minSalary = offer.minSalary / 100;
    }
    this.isMenu = true;
    this.canRequestLoan = true;
    this.showOffer = true
    // this.showForm = true;
    // this.showAccount = true;()
    swal.fire({
      title: '<strong>LOAN OFFERS</strong>',
      type: 'success',
      html:
        'LOADED SUCCESSFULLY!!'
    });
  }

  toggleShowForm() {
    this.showOffer = true;
    this.showForm = false;

  }

  toggleShowOffer() {
    this.showOffer = false;
    // this.showForm = false;
    this.showAccount = true;
    this.canSubmit = false;
  }








  selectedOffer(offer) {
    this.choosenOffer = offer;
    this.tenorMin = offer.tenorFrom;
    this.tenorMax = offer.tenorTo;
    this.requestForm.controls.tenor.setValidators([Validators.required, CustomValidators.number, CustomValidators.range([this.tenorMin, this.tenorMax])])
    this.requestForm.controls.tenor.setValue(this.tenorMin)

    this.loanMin = offer.loanAmtFrom;
    this.loanMax = offer.loanAmtTo;
    this.requestForm.controls.amount.setValidators([Validators.required, CustomValidators.number, CustomValidators.range([this.loanMin, this.loanMax])])
    this.requestForm.controls.amount.setValue(this.loanMin)

    this.description = offer.description;
    this.title = offer.title
    this.interest = offer.interest;
    this.amountPayable = uni.calcPayable(this.loanMin, this.tenorMin, this.interest);
    this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
    // this.requirements = offer.requirements
    // this.requirements = checkRequirements(this.requirements)
    // //I added this
    // for (let req of this.requirements) {
    //   req.url = '';
    // }
    this.showForm = true;
    this.showAccount = true;
    this.showOffer = false;
  }



  //   selectedOffer(offer) {
  // console.log(offer, 'ppppppppppp');

  //     this.choosenOffer = offer;
  //     this.tenorMin = offer.tenorFrom;
  //     this.tenorMax = offer.tenorTo;

  //     if (this.tenorMax <= 30) {
  //       this.tenorInMonths = this.tenorMax / 30;
  //       this.disableTenor = true;
  //       this.requestForm.controls.tenor.setValue(this.tenorMax)
  //     } else {
  //       let tenorRange = this.tenorMax;
  //       console.log(Number(tenorRange), this.tenorMin, 'ddddddd');
  //       do {
  //         this.tenorDisplay.push(tenorRange)
  //         tenorRange = tenorRange - 30
  //         console.log(tenorRange, 'yyyyy');
  //       }
  //       while (Number(tenorRange) >= Number(this.tenorMin))
  //       console.log(this.tenorDisplay, 'rrrrrr');

  //       this.disableTenor = false;
  //       this.tenorInMonths = this.tenorMin / 30;
  //       this.requestForm.controls.tenor.setValue(this.tenorMin)
  //     }
  //     this.requestForm.controls.tenor.setValidators([Validators.required, CustomValidators.number, CustomValidators.range([this.tenorMin, this.tenorMax])])
  //     // this.requestForm.controls.tenor.setValue(this.tenorMin)

  //     this.loanMin = offer.loanAmtFrom;
  //     // this.loanMinFormattedAmt = this.loanMin /100;
  //     this.loanMax = offer.loanAmtTo;
  //     this.requestForm.controls.amount.setValidators([Validators.required, CustomValidators.number, CustomValidators.range([this.loanMin, this.loanMax])])
  //     this.requestForm.controls.amount.setValue(this.loanMin)

  //     this.description = offer.description;
  //     this.title = offer.title
  //     this.interest = offer.interest;
  //     this.paymentOffer = uni.calcRecurringLoanAmount(this.loanMin, this.tenorInMonths, this.interest, uni.mercPerc)
  //     // this.amountPayable = uni.calcPayable(this.loanMin, this.tenorMin, this.interest);
  //     this.amountPayable = this.paymentOffer.monthlyRepayments;
  //     this.amountPayableNGN = this.amountPayable / 100;
  //     this.disburseAmtNGN = this.paymentOffer.disburseAmt / 100;
  //     this.interestNGN = this.paymentOffer.interest / 100;
  //     this.totalMonthlyInstallments = this.interestNGN;

  //     // this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  //     this.requirements = offer.requirements
  //     // this.requirements = checkRequirements(this.requirements)
  //     //I added this
  //     // for (let req of this.requirements) {
  //     //   req.url = '';
  //     // }
  //     this.showForm = true;
  //     this.showAccount = true;
  //     this.showOffer = false;
  //   }


  finishReset() {
    this.getLoansByUser()
    this.uploadView = false;
    this.showForm = false
    this.showOffer = false;
    this.showLoanDetails = false
  }


  finishLoanUploads() {
    this.checkCompletedRequirements(this.requirements)
      .then(res => {
        if (res === true) {
          this.finishReset()
          // swal.fire('LOAN REQUEST', 'Your documents have been sent', 'success')
        } else {
          swal.fire('REQUEST LOAN', 'Upload all requested documents', 'info')
        }
      })
  }


  showUpload(entryPoint?, loanObject?) {
    this.uploadView = !this.uploadView;
    this.showForm = false
    this.showOffer = false;
    if (entryPoint == 'continue') {
      this.loanId = loanObject._id;
      this.returningBorrower = true;
      if (!loanObject.requirements && loanObject.loan_template) {
        this.requirements = loanObject.loan_template.requirements
        this.requirements = checkRequirements(this.requirements)
        for (let req of this.requirements) {
          req.url = '';
        }
      } else if (loanObject.requirements) {
        this.requirements = loanObject.requirements
      }
    }
  }

  // showUpload() {
  //   this.uploadView = !this.uploadView;
  //   // this.showForm = true;
  //   // this.showOffer = false;
  // }

isDisbursedLoan:boolean = false;
  getLoansByUser() {
    swal.fire({
      title:"BIZIPAY LOANS",
      text: 'Fetching loans. Please wait...',
     type:"info",
      animation: true,
      allowOutsideClick: false,
      timer: 20000,
      onBeforeOpen:()=>{
        swal.showLoading()
      }
    });
    // swal.showLoading();
    let model = {
      xid: this.bu._id,
      scheme: uni.scheme,
    };
    this.seedService.getLoansByUserId(model).then(loans => {
      //remove this later
      // loans = []

      if (loans.length > 0) {
        for (var i = 0; i < loans.length; i++) {
          loans[i]['principal'] = loans[i].details[0].principal / 100;
          loans[i]['interest'] = loans[i].details[0].interest / 100;
          loans[i]['duration'] = loans[i].details[0].duration;
          //i added this
          if (loans[i].status === 'Disbursed') {
           this.isDisbursedLoan = true
          } 
        }
        this.lt_loan_history = loans;
        // console.log(this.lt_loan_history, 'ooooo');

        // this.lt_loan_history[0]['status']= 'Repaid'
        localStorage.LoanHistory = JSON.stringify(loans);
        swal.close();
        this.gettingLoans = false
      } else {//No loans yet
        this.lt_loan_history = []
        swal.fire('NO LOAN!', 'YOU CURRENTLY HAVE NO LOANS!!', 'success');
        this.gettingLoans = false
      }
    });
  }


  //This is needed if the requirements are not just file upload
  selectedRequirement(req) {
    this.selectedReq = req
    if (req === "SalaryAccountDetails" || req === "PensionAccount") {
      this.account = true
    } else if (req === "ApplicantGuarantor") {
      this.guarantor = true
    }

  }




  requestUpload() {
    swal.fire({
      title: 'REQUIREMENT UPLOAD',
      text: 'Please wait while we upload your document...',
      timer: 100000,
      type:'info',
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
                swal.fire('REQUIREMENT UPLOAD', 'Document Uploaded', 'success');
                return
              }
            })
            //get the loan Id from the loan response
            // this.updateLoansRequirement(loanId, this.requirements)

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
            this.updateLoansRequirement(this.loanId, this.requirements)

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
    console.log(event, 'iiiiii')
    this.selected = event.target.files[0];
    console.log(this.selected, 'pppppp');

    this.getBase64(this.selected)
      .then(data => {
        this.base64String = data
      });
  }




  updatePayable() {
    this.amountPayable = uni.calcPayable(this.requestForm.value.amount, this.requestForm.value.tenor, this.interest);
    this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  }




  // updatePayable() {

  //   this.tenorInMonths = this.requestForm.value.tenor / 30;
  //   console.log(this.tenorInMonths, 'dddd');

  //   this.paymentOffer = uni.calcRecurringLoanAmount(this.requestForm.value.amount, this.tenorInMonths, this.interest, uni.mercPerc)
  //   // this.amountPayable = uni.calcPayable(this.loanMin, this.tenorMin, this.interest);
  //   this.amountPayable = this.paymentOffer.monthlyRepayments;
  //   this.amountPayableNGN = this.amountPayable / 100;
  //   this.disburseAmtNGN = this.paymentOffer.disburseAmt / 100;
  //   this.interestNGN = this.paymentOffer.interest / 100;
  //   this.totalMonthlyInstallments = this.interestNGN;

  //   // this.amountPayable = uni.calcPayable(this.requestForm.value.amount, this.requestForm.value.tenor, this.interest);
  //   // this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  // }

  // params: loan ID and requirements object send as params: _id and requirements
  updateLoansRequirement(loanId, requirements) {
    const model = {
      _id: loanId,
      requirements
    }
    this.seedService.updateLoanRequirement(model)
      .then(res => {
        console.log(res, 'mmmmm');
        if (res) {
          swal.fire('REQUIREMENT UPLOAD', 'Document Uploaded', 'success');
        } else {
          swal.fire("REQUIREMENT UPLOAD", "File upload failed", 'info');
        }

      })
  }




















  ngOnInit() {
    this.getLoansByUser();
    this.createForm();
  };

  checkOffer(val) {
    this.offer = val;
    console.log('CheckSex val: ' + val);
    for (var i = 0; i < this.loanOffers.length; i++) {
      if (this.loanOffers[i].offerId == val) {
        this.amountOffered = this.loanOffers[i].amountOffered;
        this.amountPayable = this.loanOffers[i].amountPayable;
        this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
        this.interest = this.loanOffers[i].interest;
        this.tenure = this.loanOffers[i].tenure;
      }
    }

  }
  checkAgreed() {
    // if(this.isAgreed){this.isAgreedtenor=false;}else{this.isAgreed=true;}

  }
  proceed() {
    this.canSave = true;
  }
  proceedToAgreement() {
    this.canProceed = true;
  }
  disbureLoan() {
    swal.fire({
      title: 'Disbursing Loan! Please wait...',
      imageUrl: '../../../../assets/img/logo.png',
      customClass:{image:'logoModal'},
      imageAlt: uni.scheme,
      animation: true,
      allowOutsideClick: false,
      timer: 10000
    });
    swal.showLoading();
    let model = {
      xid: this.bu._id,
      userFullname: this.bu.fName + ' ' + this.bu.sName,
      userMobile: '+' + this.bu.mobile,
      userCode: this.bu.qrCode,
      isOverdue: false,
      hasPaid: false,
      status: "Running",
      principal: this.amountOffered,
      interest: this.amountPayable,
      duration: this.tenure,
      perc: this.interest,
      dueDate: "",
      elapsedSn: "0",
      loan_score: this.mainLoanOffers[0].loan_score
    };
    this.seedService.disburseLoan(model).then(result => {
      this.router.navigate(['/pages/home'])
      swal.getTitle().textContent = 'Your Loan is on the way!'; swal.hideLoading();
    })
  }


  backUp() {
    this.canSave = false;
    this.canProceed = false;
  }


}






// loanFlow() {
  //   swal.fire({
  //     title: 'Fetching loan offers. Please wait...',
  //     imageUrl: '../../../assets/img/logo.png',
  //     imageWidth: 150,
  //     imageHeight: 150,
  //     imageAlt: uni.scheme,
  //     animation: true,
  //     allowOutsideClick:false,
  //     timer:20000
  //   });
  //   swal.showLoading()
  //   if ((this.lt_loan_history) && (this.lt_loan_history.length >= 1)) {
  //     if (this.lt_loan_history[0].status == "Disbursed") {//Exisiting loan: Show repayment flow!!
  //       // console.log('You have an exisitng loan!')
  //       swal.fire('Existing Loan', 'You have an exisitng loan!', 'warning')
  //       this.canRequestLoan = false;
  //       this.loans_history = "history";
  //     }
  //     else if (this.lt_loan_history[0].status == "Pending") {//Exisiting request: Do nothing
  //       // console.log('You have an pending request!')
  //       swal.fire('Pending Request', 'You have a pending request. Please give us some time!', 'warning')
  //       this.canRequestLoan = false;
  //       this.loans_history = "history";
  //     }
  //     if (this.lt_loan_history[0].status == "Repaid") {//Can request loan: Do request flow!!
  //       this.canRequestLoan = true;
  //       this.loans_history = "loans";

  //       let model = {
  //         scheme: uni.scheme
  //       }
  //       this.seedService.getGenericLoans(model).then(body => {
  //         console.log('Offer Body: ' + JSON.stringify(body)); console.log('Offers Body length: ' + body.length)
  //         this.lt_loanOffers = body;
  //         this.lt_loanOffers.sort(uni.compareTitle);
  //         if (this.lt_loanOffers.length > 0) {
  //           this.offer = this.lt_loanOffers[0];
  //           let maxAmount = this.lt_loanOffers[0].loanAmtTo / 100;

  //           var loanScoreModel = {
  //             amount: maxAmount * 100,
  //             transaction_desc: "Loan advice for " + uni.scheme,
  //             customer_ref: this.bu.mobile.substring(1),
  //             firstname: this.bu.fName,
  //             surname: this.bu.sName,
  //             email: this.bu.email,
  //             mobile_no: this.bu.mobile.substring(1)
  //           };
  //           this.seedService.getLoanScore(loanScoreModel).then(loanScore => {
  //             console.log('getLoanScore: ' + JSON.stringify(loanScore));
  //             if (loanScore.status == "Successful") {
  //               // console.log('Successful')
  //               if (loanScore.data) {
  //                 this.loanScore = loanScore;
  //                 // console.log('loanScore.data')
  //                 this.amt = 0; this.tenor = 0; this.interest = 0;
  //                 let loanScoreAmount: any = loanScore.data.score.amount + '00';
  //                 console.log('loanScoreAmount: ' + loanScoreAmount); console.log('this.lt_loanOffers[0].loanAmtTo: ' + this.lt_loanOffers[0].loanAmtTo)
  //                 if ((loanScoreAmount * 1) >= (this.lt_loanOffers[0].loanAmtTo * 1)) {//Show Loan Template
  //                   console.log('Show Loan Template')
  //                   // this.loanMin=this.lt_loanOffers[0].loanAmtFrom /100; this.loanMax=this.lt_loanOffers[0].loanAmtTo/100;
  //                   this.loanMin = 1000;
  //                   this.loanMax = 5000;
  //                 }
  //                 else {//No confidence
  //                   console.log('! Show Loan Template')
  //                   this.loanMin = 1000;
  //                   this.loanMax = 5000;
  //                 }
  //               }
  //               else {// No loan data
  //                 console.log('! loanScore.data: Data is null')
  //                 this.loanMin = 1000;
  //                 this.loanMax = 5000;
  //               }
  //             }
  //             else {// no Loan data
  //               console.log('! loanScore.data: Not successful')
  //               this.loanMin = 1000;
  //               this.loanMax = 5000;
  //             }
  //             this.LoanOffers = this.lt_loanOffers[0].title;
  //             this.description = this.lt_loanOffers[0].description;
  //             this.amt = this.loanMin;
  //             this.tenor = this.lt_loanOffers[0].tenorFrom * 1;
  //             this.interest = this.lt_loanOffers[0].interest;
  //             this.tenorMin = this.lt_loanOffers[0].tenorFrom;
  //             this.tenorMax = this.lt_loanOffers[0].tenorTo;
  //             this.amountPayable = uni.calcPayable(this.amt, this.tenor, this.interest);
  //             this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  //             if (this.tenorMax <= 30) {
  //               this.tenorSteps = 1;
  //             } else {
  //               this.tenorSteps = 30;
  //             }
  //             swal.fire({
  //               title: '<strong>LOAN OFFERS</strong>',
  //               type: 'success',
  //               html:
  //                 'LOADED SUCCESSFULLY!!'
  //             });
  //           });
  //         }
  //         else {
  //           swal.fire({
  //             title: '<strong>LOAN OFFERS</strong>',
  //             type: 'error',
  //             html: '<h6><b>COULD NOT LOAD OFFERS AT THIS TIME</b></h6>'
  //           });
  //         }
  //       });
  //     }
  //   }
  //   else {// No Loans

  //     let model = {
  //       scheme: uni.scheme
  //     }
  //     this.seedService.getGenericLoans(model).then(body => {
  //       console.log(body, 'hhhhh');


  //       this.lt_loanOffers = body;
  //       this.lt_loanOffers.sort(uni.compareTitle);

  //       if (this.lt_loanOffers.length > 0) {
  //         let maxAmount = this.lt_loanOffers[0].loanAmtTo / 100;
  //         console.log(maxAmount, 'jjjj');
  //         var loanScoreModel = {
  //           amount: maxAmount * 100,
  //           transaction_desc: "Loan advice for " + uni.scheme,
  //           customer_ref: this.bu.mobile.substring(1),
  //           firstname: this.bu.fName,
  //           surname: this.bu.sName,
  //           email: this.bu.email,
  //           mobile_no: this.bu.mobile.substring(1)
  //         };
  //         this.seedService.getLoanScore(loanScoreModel).then(loanScore => {
  //           console.log('getLoanScore: ' + JSON.stringify(loanScore));
  //           if (loanScore.status == "Successful") {
  //             // console.log('Successful')
  //             if (loanScore.data) {
  //               this.loanScore = loanScore;
  //               // console.log('loanScore.data')
  //               this.amt = 0; this.tenor = 0; this.interest = 0;
  //               let loanScoreAmount: any = loanScore.data.score.amount + '00';
  //               // console.log('loanScoreAmount: '+loanScoreAmount);console.log('this.lt_loanOffers[0].loanAmtTo: '+this.lt_loanOffers[0].loanAmtTo)
  //               if ((loanScoreAmount * 1) >= (this.lt_loanOffers[0].loanAmtTo * 1)) {//Show Loan Template
  //                 // console.log('Show Loan Template')
  //                 // this.loanMin=this.lt_loanOffers[0].loanAmtFrom /100; this.loanMax=this.lt_loanOffers[0].loanAmtTo/100;
  //                 this.loanMin = 1000; this.loanMax = 5000;
  //                 this.LoanOffers = this.lt_loanOffers[0].title;
  //                 this.description = this.lt_loanOffers[0].description;
  //                 this.amt = this.loanMin; 
  //                 this.tenor = this.lt_loanOffers[0].tenorFrom * 1; 
  //                 this.interest = this.lt_loanOffers[0].interest;
  //                 this.tenorMin = this.lt_loanOffers[0].tenorFrom; 
  //                 this.tenorMax = this.lt_loanOffers[0].tenorTo;
  //                 this.amountPayable = uni.calcPayable(this.amt, this.tenor, this.interest);
  //                 this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  //                 if (this.tenorMax <= 30) {
  //                   this.tenorSteps = 1;
  //                 } else {
  //                   this.tenorSteps = 30;
  //                 }
  //                 console.log('================');

  //                 this.canRequestLoan = true;
  //                 swal.fire({
  //                   title: '<strong>LOAN OFFERS</strong>',
  //                   type: 'success',
  //                   html:
  //                     'LOADED SUCCESSFULLY!!'
  //                 });
  //               }
  //               else {//No confidence
  //                 this.loanMin = 1000; this.loanMax = 2000;
  //                 this.LoanOffers = this.lt_loanOffers[0].title;
  //                 this.description = this.lt_loanOffers[0].description;
  //                 this.amt = this.loanMin; this.tenor = 1; this.interest = this.lt_loanOffers[0].interest;
  //                 this.tenorMin = 1; this.tenorMax = 7;
  //                 this.amountPayable = uni.calcPayable(this.amt, this.tenor, this.interest);
  //                 this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  //                 if (this.tenorMax <= 30) { this.tenorSteps = 1; } else { this.tenorSteps = 30; }
  //                 this.canRequestLoan = true;
  //                 swal.fire({
  //                   title: '<strong>LOAN OFFERS</strong>',
  //                   type: 'success',
  //                   html:
  //                     'LOADED SUCCESSFULLY!!'
  //                 });

  //               }
  //             }
  //             else {// No loan data
  //               // console.log('! loanScore.data: Data is null')
  //               console.log("----------");

  //               this.loanMin = 1000; this.loanMax = 2000;
  //               this.LoanOffers = this.lt_loanOffers[0].title;
  //               this.description = this.lt_loanOffers[0].description;
  //               this.amt = this.loanMin; this.tenor = 1; this.interest = this.lt_loanOffers[0].interest;
  //               this.tenorMin = 1; this.tenorMax = 7;
  //               this.amountPayable = uni.calcPayable(this.amt, this.tenor, this.interest);
  //               if (this.tenorMax <= 30) { this.tenorSteps = 1; } else { this.tenorSteps = 30; }
  //               this.canRequestLoan = true;
  //               swal.fire({
  //                 title: '<strong>LOAN OFFERS</strong>',
  //                 type: 'success',
  //                 html:
  //                   'LOADED SUCCESSFULLY!!'
  //               });
  //             }
  //           }
  //           else {// no Loan data
  //             // console.log('! loanScore.data: Not successful')
  //             console.log("+++++++++++++");

  //             swal.fire({
  //               title: '<strong>LOAN OFFERS</strong>',
  //               type: 'success',
  //               html:
  //                 'LOADED SUCCESSFULLY!!'
  //             });

  //             this.loanMin = 1000;
  //             this.loanMax = 2000;

  //             this.LoanOffers = this.lt_loanOffers[0].title;
  //             this.description = this.lt_loanOffers[0].description;
  //             this.amt = this.loanMin;
  //             this.tenor = 1;
  //             this.interest = this.lt_loanOffers[0].interest;
  //             this.tenorMin = 1; 
  //             this.tenorMax = 7;
  //             this.amountPayable = uni.calcPayable(this.amt, this.tenor, this.interest);
  //             this.amountPayableCharge = uni.cal_online_charge(this.amountPayable) + 200;
  //             this.requestForm.controls.amount.setValidators([Validators.required, CustomValidators.number, CustomValidators.range([this.amt, this.loanMax])])
  //             this.requestForm.controls.tenor.setValidators([Validators.required, CustomValidators.number, CustomValidators.range([this.tenorMin, this.tenorMax])])
  //             this.requestForm.controls.amount.setValue(this.amt)
  //             this.requestForm.controls.tenor.setValue(this.tenorMin)

  //             if (this.tenorMax <= 30) {
  //               this.tenorSteps = 1;
  //             } else {
  //               this.tenorSteps = 30;
  //             }
  //             this.canRequestLoan = true;
  //             // this.toggleAccount()
  //             // this.toggleCard()
  //             this.showForm = true;
  //             this.showAccount = true;
  //           }

  //         });
  //       }
  //       else {
  //         swal.fire({
  //           title: '<strong>LOAN OFFERS</strong>',
  //           type: 'error',
  //           html: '<h6><b>COULD NOT LOAD OFFERS AT THIS TIME</b></h6>'
  //         });
  //         this.canRequestLoan = false;
  //         this.loans_history = "history";
  //       }
  //     });
  //   }

  // }




  // requestLoan() {
  //   this.isLoading = true;
  //   swal.fire({
  //     title: 'REQUEST LOAN',
  //     text: 'Please wait while we process your information...',
  //     timer: 100000,
  //     onBeforeOpen:()=>{
  //       swal.showLoading()
  //     }
  //   })
  //   swal.showLoading()
  //   //   // console.log('(localStorage.Offers: '+localStorage.Offers);
  //   var model = {
  //     offer: this.offer,
  //     _id: this.bu._id,
  //     amount: this.requestForm.value.amount * 100,
  //     transaction_desc: "Loan advice for " + uni.scheme,
  //     customer_ref: this.bu.mobile.substring(1),
  //     firstname: this.bu.fName,
  //     surname: this.bu.sName,
  //     email: this.bu.email,
  //     mobile_no: this.bu.mobile.substring(1),
  //     scheme: uni.scheme,
  //     xid: this.bu._id,
  //     userFullname: this.bu.fName + ' ' + this.bu.sName,
  //     userMobile: this.bu.mobile,
  //     userCode: this.bu.qrCode,
  //     isOverdue: false,
  //     hasPaid: false,
  //     status: "Pending",
  //     principal: this.requestForm.value.amount * 100,
  //     interest: this.amountPayable * 100,
  //     // duration: this.tenor,
  //     duration: this.requestForm.value.tenor,
  //     perc: this.interest,
  //     dueDate: "",
  //     elapsedSn: "0",
  //     account_name: this.disburseAccountName,
  //     account_code: this.disburseAccountCode,
  //     account_no: this.disburseAccountNo,
  //     loanScore: this.loanScore,
  //     selected_loan_title: this.title,
  //     selected_loan_id: this.selectedLoanId,
  //     selected_loan_description: this.description
  //   };

  //   this.seedService.disburseLoanWithFullData(model).then(requestLoan => {
  //     console.log('disburseLoanWithFullData: ' + JSON.stringify(requestLoan));
  //     let transfermodel = {
  //       account_bank: this.disburseAccountCode,
  //       account_number: this.disburseAccountNo,
  //       amount: this.requestForm.value.amount,
  //       // amount: "50",
  //       narration: "Accounts transfer for " + this.bu.fName + ' ' + this.bu.sName + ' with loanID-' + requestLoan._id,
  //       currency: "NGN"
  //     }







  //     this.seedService.doFWTransfer(transfermodel).then(res => {
  //       console.log('doFWTransfer: ' + JSON.stringify(res));
  //       if (res.status == "success") {
  //         let date = moment(Date.now()).format('DD MM YYYY, HH:mm:ss');
  //         requestLoan.status = 'Disbursed';
  //         requestLoan.details[0].dueDate = moment(date, "DD-MM-YYYY").add('days', Number(requestLoan.details[0].duration)).format('DD MM YYYY, HH:mm:ss');
  //         requestLoan.details[0]["disburseDate"] = date;

  //         let adminInfo: any = {
  //           _id: "self",
  //         }
  //         let beneficiaryInfo: any = {
  //           _id: this.bu._id,
  //           fullname: this.bu.fName + " " + this.bu.sName,
  //           mobile: this.bu.mobile,
  //           qrCode: this.bu.qrCode
  //         }
  //         let transferObjectModel = {
  //           scheme: uni.scheme,
  //           transferType: "NIP",
  //           transferProvider: "flutterwave",
  //           transferChannel: "web",
  //           transactionData: res,
  //           loanID: this.bu._id,
  //           narration: "Accounts transfer for " + this.bu.fName + " " + this.bu.sName + ' with loanID-' + this.bu._id,
  //           adminInfo: adminInfo,
  //           beneficiaryInfo: beneficiaryInfo
  //         }
  //         console.log('transferObjectModels: ' + JSON.stringify(transferObjectModel));
  //         this.seedService.registerTransaction(transferObjectModel).then(res => {

  //           console.log('Transaction Registration Res: ' + JSON.stringify(res));

  //           requestLoan.details[0]["disburseTransactionID"] = res._id;
  //           this.seedService.updateLoanStatusToDisburse(requestLoan).then(res => {
  //             console.log('Disburse Res: ' + res);
  //             var model = {
  //               "from": uni.scheme,
  //               "to": this.bu.mobile,
  //               // "to":"+2348034654797",
  //               "text": "Your N" + this.requestForm.value.amount + " '" + this.lt_loanOffers[0].title + "' loan has been disbursed to your " + requestLoan.disburseAccount.account_name + "\r\n" +
  //                 'Thank you for using ' + uni.scheme + " Loans."
  //             }
  //             this.seedService.sendSMS(model).then(sms => {
  //               // this.doGetLoans();
  //               this.loans_history = "history";
  //               this.showForm = true
  //               this.requestForm.reset()
  //               // this.isProceed=false;
  //               // this.isBank=false;
  //               this.requirements.length> 0?this.uploadView = true:this.uploadView = false;

  //               this.canSubmit = false;
  //               this.showAccount = false;
  //               this.isLoading = false;
  //               swal.fire('LOAN REQUEST', 'WELL DONE, YOUR LOAN REQUEST WAS SENT SUCCESSFULLY!!', 'success');
  //             });
  //           });
  //         });

  //       }
  //       else {//NIP did not work
  //         console.log('NIP Error: ' + JSON.stringify(res));
  //         swal.close()
  //         this.isLoading = false;
  //       }

  //     })

  //   });
  // }