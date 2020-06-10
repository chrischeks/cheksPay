// linear-gradient(180deg, #07A4D9 0%, #03779E 100%)

export const coy:string= "Bizi Pay";
export const scheme:string= "BiziPay";
export const scheme_full:string= "BiziPay";
export const signInTitle='BiziPay';
export const footerText='www.bizipay.com';
export const footerURL='https://www.bizipay.com';
// export const rootURL:string = 'http://localhost:1224/';
export const rootURL = 'http://172.105.84.55:1224/';
export const baseURL='http://172.105.84.55:5111/api/v2/';
// export const rootURL1 = 'http://172.105.84.55:1234/';
export const bucket = 'rubikpay.spectrumbucket';
export const apiKey = "sk-n2m8jlwdk7yp6pt3";

export const socketURL:string = 'http://localhost:4444/';
// export const socketURL = 'http://172.105.84.55:4444/';
export const k:string='sk_live_1e7ceb7c4d6ecc2802dc8e226f67c00fe04003e5';

// export const k:string='sk_live_1e7ceb7c4d6ecc2802dc8e226f67c00fe04003e5';
// export const k:string= 'sk_live_68d29df3e7e36365a2ee972b8c6e683c1d33f9a2'; 
// export const k:string='sk_test_dace86bffe2edf5a64ae69d17a6ac89535f1b507';
export const coymCashCode:string='*402*32993126*';
export const bank_name:string= "Ecobank (Providence Microfinance Bank)";
export const bank_account:string= "4490002552";
export const mercPerc:number=3;
export  function getBaseUserRandomNumber()
{ 
  return new Promise((resolve,reject)=>{
var rd='';  //   var rd= randomize('A0', 6);var cnt=0;
    resolve(rd);
    });
}
export function formatFromKobo(amt){
    return ((amt*1)/100)
 }
 export function calcPayable(amt,tenor,interest){
    console.log('Amt: '+amt); console.log('tenor: '+tenor); console.log('interest: '+interest);
    let tenorx=tenor*1;
    let intx=(interest/100) * 1;
    intx=intx*amt;
    let totinterest=intx * tenorx;
    let amtx=amt*1;
   
    
   return (totinterest+amtx)
}
export function  compareLabels( a, b ) {
 if ( a.label < b.label ){
   return -1;
 }
 if ( a.label > b.label ){
   return 1;
 }
 return 0;
}
export function  compareTitle( a, b ) {
 if ( a.title < b.title ){
   return -1;
 }
 if ( a.title > b.title ){
   return 1;
 }
 return 0;
}
export function maskAccountNumber(num){
 let first3=num.substring(1,4); let last3=num.substring(7,10);
 return first3+"****"+last3;
 }
export function checkRequirements(myReqs){
 let lt_requirements=new Array();
 let fullRequirements=new Array();
 fullRequirements=[
   "EmploymentLetter",
   "IPPIS",
   "SalaryAccountDetails",
   "statement4",
   "statement6",
   "UtilityBill",
   "ValidID",
   "ApplicantGuarantor",
   "PensionAccount",
   "SatisfactoryCreditReport",
   "BankMandate",
   "pastPaymentEvidence",
   "estateAgentOffeLetter",
   "directCreditToEstateAgent"
 ];
 for(var r=0;r<myReqs.length;r++)
 {
   if(fullRequirements.includes(myReqs[r])){
     if(myReqs[r]=='EmploymentLetter'){
       let option={value:'EmploymentLetter',label:'Employment Letter'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='IPPIS'){
       let option={value:'IPPIS',label:'IPPIS'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='SalaryAccountDetails'){
       let option={value:'SalaryAccountDetails',label:'Salary account details'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='statement4'){
       let option={value:'statement4',label:'4 months bank statement'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='statement6'){
       let option={value:'statement6',label:'6 months bank statement'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='UtilityBill'){
       let option={value:'UtilityBill',label:'Utility bill'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='ValidID'){
       let option={value:'ValidID',label:'Valid ID'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='ApplicantGuarantor'){
       let option={value:'ApplicantGuarantor',label:'Applicant Guarantor\'s Details'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='PensionAccount'){
       let option={value:'PensionAccount',label:'Pension account'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='SatisfactoryCreditReport'){
       let option={value:'SatisfactoryCreditReport',label:'Credit Report'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='BankMandate'){
       let option={value:'BankMandate',label:'Bank mandate'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='pastPaymentEvidence'){
       let option={value:'pastPaymentEvidence',label:'Evidence of past payment'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='estateAgentOffeLetter'){
       let option={value:'estateAgentOffeLetter',label:'Estate agent offer letter'};lt_requirements.push(option);
     }
     else if(myReqs[r]=='directCreditToEstateAgent'){
       let option={value:'directCreditToEstateAgent',label:'Credit to estate agent'};lt_requirements.push(option);
     }
   }
 }
return lt_requirements;
}
export function cal_online_charge(amt)
{  
   return Math.round( (amt / 0.985) * 1 );
}
export function preparePurchase(wallet,amount)
{  
 let model={
  canProceed:false,
  reason:'',
  wallet:wallet
 }
 if((amount)>wallet.ledger_balance)
 {//Low funds
   model.canProceed=false;model.reason="Insufficient Balance";
 }
 else{
   model.canProceed=true;model.reason="Sufficient Balance";
   wallet.ledger_balance=(wallet.ledger_balance-(amount));
   wallet.transaction_funds=((wallet.transaction_funds*1)+(amount));
   wallet.isLocked=false;
   model.wallet=wallet;
 }
 return model;
}
export function revertPreparePurchase(wallet,amount){
  let model={
    canProceed:false,
    reason:'',
    wallet:wallet
   }
   if((amount)>wallet.ledger_balance)
   {//Low funds
     model.canProceed=false;model.reason="Insufficient Balance";
   }
   else{
     model.canProceed=true;model.reason="Sufficient Balance";
     wallet.ledger_balance=(wallet.ledger_balance+(amount));
     wallet.transaction_funds=((wallet.transaction_funds*1)-(amount));
     wallet.isLocked=false;
     model.wallet=wallet;
   }
   return model;
}
export function debitWallet(wallet,amount)
{
 wallet.balance=wallet.ledger_balance;
 wallet.transaction_funds=((wallet.transaction_funds*1)-(amount));
 wallet.isLocked=false;
 return wallet;
}
export function reverseDebitWallet(wallet,amount)
{
 wallet.balance=wallet.ledger_balance;
 wallet.transaction_funds=((wallet.transaction_funds*1)+(amount));
 wallet.isLocked=false;
 return wallet;
}
export function creditWallet(wallet,amount)
{
    
 wallet.balance=((wallet.ledger_balance*1)+(amount))
 wallet.ledger_balance= wallet.balance;
//  wallet.transaction_funds=((wallet.transaction_funds*1)-(amount));
 wallet.isLocked=false;
 return wallet;
}
export function failedCreditWallet(wallet,amount)
{
    
 wallet.balance=((wallet.ledger_balance*1)-(amount))
 wallet.ledger_balance= wallet.balance;
 wallet.isLocked=false;
 return wallet;
}
export function alphanumeric_unique() {
 return Math.random().toString(36).split('').filter(function (value, index, self) {
     return self.indexOf(value) === index;
 }).join('').substr(2, 8);
}

export function calcRecurringLoanAmount(principal,tenor,interest,mgtPerc){
  console.log('principal: '+principal); console.log('tenor: '+tenor); console.log('interest: '+interest);
  let mgtPercx:number=(mgtPerc/100) * 1;
  let mgtFees:number=0;
  let disburseAmt:number=0;
  let monthlyInterest:number=0;
  let monthlyPrincipleRepayment:number=0;
  let monthlyRepayments:number=0;
  let repaymentSchedule=new Array();
  let loanOffer:any={};
  let principalx:number=principal*1;
  let tenorx:number=tenor*1;
  let intx:number=(interest/100) * 1;
  console.log('intx: '+intx);

  mgtFees=mgtPercx * principalx;  //console.log('mgtFees: '+mgtFees);
  disburseAmt=principalx-mgtFees;  //console.log('disburseAmt: '+disburseAmt);
  monthlyInterest=(principalx *intx)
  monthlyPrincipleRepayment= Number((principalx/tenorx).toFixed(2))
  monthlyRepayments= (monthlyPrincipleRepayment + monthlyInterest);  //console.log('monthlyRepayments: '+monthlyRepayments);

  loanOffer.principal=principal*100;
  loanOffer.duration=tenor;
  loanOffer.perc=interest;  
  loanOffer.mgtFees=mgtFees*100;
  loanOffer.disburseAmt=disburseAmt*100;
  loanOffer.monthlyPrincipleRepayment=monthlyPrincipleRepayment*100;
  loanOffer.monthlyInterest=monthlyInterest*100;
  loanOffer.monthlyRepayments=monthlyRepayments*100;
  loanOffer.totalInterest=loanOffer.monthlyInterest*tenorx;
  loanOffer.interest=Math.round(loanOffer.monthlyRepayments*tenorx);
  loanOffer.repaymentSchedule=repaymentSchedule;
  for(var i=0;i<tenorx;i++){
    let obj:any={};
    obj.monthlyInterest=monthlyInterest*100;
    obj.monthlyRepayments=monthlyRepayments*100;
    obj.hasPaid=false;
    obj.dueDate="";
    repaymentSchedule.push(obj);
  }
  console.log('loanOffer: '+JSON.stringify(loanOffer));
 return (loanOffer)
}
export function calcScore(loans:any){
  console.log('loans: '+loans);
  let index=0; let ltKeys=new Array();let ltValues=new Array();
  const map = loans.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
  ltKeys=[ ...map.keys() ];ltValues=[ ...map.values() ];
// console.info([...map.keys()])//Unique loan amounts
// console.info([...map.values()])//Number of occurances
// console.info([...map.entries()])//
if(loans.length>0)
{
     if(ltKeys.indexOf(7500)!=-1) 
     {
        if(ltValues[ltKeys.indexOf(7500)]>=2){//Offer 7500
          return 10000;
        }
        else{
          return 7500;
        }
     }
      if(ltKeys.indexOf(5000)!=-1){
          if(ltValues[index]>=2){//Offer 7500
            return 7500;
          }
          else{
            return 5000;
          }
      }    
     if(ltKeys.indexOf(2000)!=-1) {
        if(ltValues[index]>=2){//Offer 7500
          return 5000;
        }
        else  {
          return 2000;
          }
     }
  }
  else{
    return 2000;
  }
}