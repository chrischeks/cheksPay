import { ToastModule } from 'ng-uikit-pro-standard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes.service';
import { environment } from '../environments/environment';
import { ViewsModule } from './views/views.module';
import { SharedModule } from './shared/shared.module';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { ErrorModule } from './views/errors/error.module';
import { SeedService } from './providers/seed.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserHeaderComponent } from './user-layout/navigtion/user-header/user-header.component';
import { UserFooterComponent } from './user-layout/navigtion/user-footer/user-footer.component';
import { UploadsService } from './providers/upload.service';

@NgModule({
  declarations: [
    AppComponent,
    UserHeaderComponent,
    UserFooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutes,
    RouterModule,
    FormsModule,
    SharedModule,
    ViewsModule,
    ErrorModule,
    ToastModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [MDBSpinningPreloader,SeedService,JwtHelperService, UploadsService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
