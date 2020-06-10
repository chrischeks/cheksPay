import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SeedService } from './seed.service';
import * as uni from '../globals/universal';

@Injectable({
  providedIn: 'root'
})
export class ViewLoanResolverService implements Resolve<any>{
  constructor(private seedService: SeedService) { }

  resolve(route:ActivatedRouteSnapshot, rstate: RouterStateSnapshot):Observable<any>|Promise<any>{
    const model = {
      x: route.paramMap.get('id'),
      scheme: uni.scheme
    }
    return this.seedService.getLoansById(model)
  }
     
}

