import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import * as uni from '../globals/universal';
 
@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  sk=uni.k;
  rootURL = uni.rootURL;
  scheme=uni.scheme;


  constructor(private http:HttpClient) { }
  getDocuments(model) {
    let apiURL = `${this.rootURL}documents/getDocuments/`;  
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
  return this.http.post(apiURL,model,{headers}).toPromise();
  }
 
  deleteDocument(model) {
    let apiURL = `${this.rootURL}documents/deleteDocument/`;  
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
  return this.http.post(apiURL,model,{headers}).toPromise();
  }
 
  
uploadPassport(model): Promise<any>{
  // console.log(JSON.stringify(model))
  let apiURL = `${this.rootURL}uploads/uploadPassport/`;  
  const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  return this.http.post(apiURL,model,{headers}).toPromise();
  }
uploadDocuments(model): Promise<any>{
  // console.log(JSON.stringify(model))
  let apiURL = `${this.rootURL}uploads/uploadPassport/`;  
  const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  return this.http.post(apiURL,model,{headers}).toPromise();
  }
}
