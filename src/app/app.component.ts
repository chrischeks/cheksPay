import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'mdb-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']

})

export class AppComponent implements OnInit {
  specialPage: boolean=false;

  private specialPages: any[] = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
  ];
  
  
  constructor(
    private router: Router,
    private location: Location
  ) {

  }
  isSpecialPage(): boolean {
    const currentUrl = `${this.router.url || '/'}`.split('?')[0];
    return this.specialPages.includes(currentUrl);
  }
  ngOnInit(): void {}

  goBack(): void {this.location.back(); }
}
