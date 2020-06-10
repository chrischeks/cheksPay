import { Injectable } from '@angular/core';
import { Router, CanActivate,ActivatedRouteSnapshot } from '@angular/router';
import {AuthService} from '../providers/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate{

  constructor(public auth: AuthService, public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {    
    // this will be passed from the route config on the data property
    const allowedRoles = route.data['allowedRoles'];    
    const bu:any =JSON.parse(localStorage.getItem('BaseUser')) ;  
    if(bu)
    {// console.log('BaseUser: '+JSON.stringify(bu))
      if((bu.roles.some(r=>allowedRoles.includes(r))) && (this.auth.isAuthenticated)) 
        {return true; } 
        else {
          this.router.navigate(['/pages/login']);
          return false; 
        }

    }
    else {
      this.router.navigate(['/pages/login']);
      return false;
    }

    // return true;
  }
}
