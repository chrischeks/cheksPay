import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as uni from "../globals/universal";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const unAuthURLs = ["/auth/login", "https://api.paystack.co/transaction/verify", "https://api.paystack.co/transaction/charge_authorization"]
    if (!unAuthURLs.some(data => request.url.includes(data))) {
      let accessToken = this.userService.getToken();

      if (accessToken) {
        request = request.clone({
          setHeaders: {
            "authorization": `Bearer ${accessToken}`
          }
        });
      }
    }

    return next.handle(request);

  }

}
