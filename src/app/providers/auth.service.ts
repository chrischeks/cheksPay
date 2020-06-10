import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isAuthenticated(): boolean {
    const bu: any = JSON.parse(localStorage.getItem('BaseUser'));
    if (bu) {
      if (bu.accessToken) {
        return true;
      } else {
        return false;
      }
    }
    else { return false; }
  }
}
