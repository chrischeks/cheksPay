import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Variation } from '../../../../models/variation.model';
import { Observable } from 'rxjs';
import { Verify } from '../../../../models/verify.model';

@Injectable({
  providedIn: 'root'
})

export class BillsServiceService {

  constructor(private http: HttpClient) { }
  


  getVariations(serviceID):Observable<Variation>{
   return this.http.get<Variation>(`${environment.BASEURL}/vtpass/tv/get-variation-code?serviceID=${serviceID}`)
  }

  verifyElectricMeter(body):Observable<Verify>{
    return this.http.post<Verify>(`${environment.BASEURL}/vtpass/electricity/verify`, body);
  }

  payBill(body){
    return this.http.post(`${environment.BASEURL}/vtpass/utility/pay`, body);
  }

  verifySmartcard(body):Observable<Verify>{
    return this.http.post<Verify>(`${environment.BASEURL}/vtpass/tv/verify-smartcard`, body);
  }
}
