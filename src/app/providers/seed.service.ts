import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as uni from '../globals/universal';
// import { map } from 'rxjs/operators';
// import * as moment from 'moment';
// import {Md5} from 'ts-md5/dist/md5';
// import * as randomize from 'randomatic';

@Injectable()
export class SeedService {
  sk = uni.k;
  rootURL = uni.rootURL;
  baseURL = uni.baseURL;
  scheme = uni.scheme;


  constructor(private http: HttpClient) { }
  $balanceChange = new EventEmitter<any>();

  refreshBalance(ledgerBalance) {
    this.$balanceChange.emit(ledgerBalance);
  }
  login(model): Promise<any> {
    let apiURL = `${this.rootURL}auth/login/`;
    // let apiURL = `http://localhost:1224/auth/login/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  registerTxPIN(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}auth/registerTxPIN/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getCode(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}auth/sendRegCode/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  createWallet(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}wallets/create/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  UpdateWallet(model): Promise<any> {
    let apiURL = `${this.rootURL}wallets/updateWallet/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  fundWallet(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}wallets/fundWallet/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  changePassword(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}auth/changePassword/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateForgotPassword(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}auth/updateForgotPassword/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  changePIN(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}auth/changePIN/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getAllUsers(model): Promise<any> {
    let apiURL = `${this.rootURL}users/getAllUsers/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getUsersByMobile(model): Promise<any> {
    let apiURL = `${this.rootURL}users/getUsersByMobile/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getUserByUserId(model): Promise<any> {
    let apiURL = `${this.rootURL}users/getUsersById/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getCollectionsByUserId(model): Promise<any> {
    let apiURL = `${this.rootURL}wallets/getTransactionById/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getGenericLoans(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/getGenericLoans/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getLoanScore(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/getloanscore/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getAllLoans(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/getAllLoans/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getLoansById(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/getLoansById/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getLoansByUserId(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/getLoansByUserId/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getLoansByStatus(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/getLoansByStatus/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getAllCards(model): Promise<any> {
    let apiURL = `${this.rootURL}cards/getAllCards/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getCardsById(model): Promise<any> {
    let apiURL = `${this.rootURL}cards/getCardsById/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getAccountsById(model): Promise<any> {
    let apiURL = `${this.rootURL}cards/getAccountsById/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getAllAccounts(model): Promise<any> {
    let apiURL = `${this.rootURL}cards/getAllAccounts/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  resolvebvn_mock(bvn: any): Promise<any> {
    let apiURL = `${this.rootURL}payments/resolvebvn_mock/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, bvn, { headers }).toPromise();
  }
  resolvebvn(bvn: any): Promise<any> {
    let apiURL = `${this.rootURL}payments/resolvebvn/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, bvn, { headers }).toPromise();
  }
  resolveaccount(model): Promise<any> {
    let apiURL = `${this.rootURL}payments/resolveaccount/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  sendOtp(model: any): Promise<any> {
    let apiURL = `${this.rootURL}auth/sendOTP/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  sendSMS(model: any): Promise<any> {
    let apiURL = `${this.rootURL}auth/sendSMS/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  registerSpectrumAccount(model: any): Promise<any> {
    let apiURL = `${this.rootURL}users/registerSpectrumAccount/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getSpectrumBalance(model: any): Promise<any> {
    let apiURL = `${this.rootURL}users/getSpectrumBalance/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  registerUser(model: any): Promise<any> {
    let apiURL = `${this.rootURL}users/register_user/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  getAllBanks(): Promise<any> {
    let apiURL = `${this.rootURL}payments/getallbanks/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, { headers }).toPromise();
  }
  addBankAccount(model: any): Promise<any> {
    let apiURL = `${this.rootURL}cards/register_account/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  addBankCard(model: any): Promise<any> {
    let apiURL = `${this.rootURL}cards/register_card/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  addBankAccountCard(model: any): Promise<any> {
    let apiURL = `${this.rootURL}cards/register_card_account/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  requestLoan(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/requestLoan/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  requestLoanData(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/requestLoan/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  disburseLoan(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/register_loan/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  disburseLoanWithFullData(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/registerLoanAllData/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  disburseLoanWithData(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/registerLoanData/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  disburseLoanWithDataAuto(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/registerLoanData/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  doFWTransfer(model): Promise<any> {
    let apiURL = `${this.rootURL}transfers/create/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  registerTransaction(model): Promise<any> {
    let apiURL = `${this.rootURL}transfers/register_transaction/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateLoanStatusToDisburse(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/updateLoanStatusToDisburse/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateLoanStatusToRepaid(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/updateLoanStatusToRepaid/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }

  updateUserImage(model): Promise<any> {
    let apiURL = `${this.rootURL}users/updateUserImage/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateUserRequirements(model): Promise<any> {
    let apiURL = `${this.rootURL}users/updateUserRequirements/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateLoanStatusToRepayed(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/updateLoanStatusToRepayed/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  /////////////////////////////////////
  getPayStackTransactions(status, id): Promise<any> {
    console.log(id)
    let apiURL = `https://api.paystack.co/transaction?&customer=${id}&perPage=2000`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + this.sk);
    // let options = new RequestOptions({ headers: headers });   
    return this.http.get(apiURL, { headers }).toPromise();
  }
  verifyTransactions(ref): Promise<any> {
    let apiURL = `https://api.paystack.co/transaction/verify/${ref}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + this.sk);

    // let options = new RequestOptions({ headers: headers });   
    return this.http.get(apiURL, { headers }).toPromise();
  }
  chargeCard(model): Promise<any> {
    let apiURL = `https://api.paystack.co/transaction/charge_authorization`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + this.sk);
    // let options = new RequestOptions({ headers: headers });   
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  uploadPassport(model): Promise<any> {
    // console.log(JSON.stringify(model))
    let apiURL = `${this.rootURL}uploads/uploadPassport/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }

  updateLoanRequirement(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/updateLoanRequirement/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  resolveSpectrumAccount(model): Promise<any> {
    let apiURL = `${this.rootURL}payments/resolveaccountSpectrum/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateBvn(model): Promise<any> {
    let apiURL = `${this.rootURL}users/updateUserBvn`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  registerLoanAllDataSpectrum(model): Promise<any> {
    let apiURL = `${this.rootURL}loans/registerLoanAllDataSpectrum/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  checkCardAccountExists(model): Promise<any> {
    let apiURL = `${this.rootURL}cards/cardAccountExists/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
  updateAccountCards(model): Promise<any> {
    let apiURL = `${this.rootURL}cards/updateAccountCards/`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.post(apiURL, model, { headers }).toPromise();
  }
}