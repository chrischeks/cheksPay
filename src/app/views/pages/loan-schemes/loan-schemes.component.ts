import { Component, OnInit } from '@angular/core';
import * as uni from '../../../globals/universal';
import { SeedService } from '../../../providers/seed.service';

@Component({
  selector: 'app-loan-schemes',
  templateUrl: './loan-schemes.component.html',
  styleUrls: ['./loan-schemes.component.scss']
})
export class LoanSchemesComponent implements OnInit {

  constructor(private seedService: SeedService) { }

  ngOnInit() {
    this.getLoanSchemes()
  }

  getLoanSchemes(){
    let model={
      scheme:uni.scheme
    }
    this.seedService.getGenericLoans(model).then(body=>{
      console.log(body, 'jjj');
      
    })
  }

}
