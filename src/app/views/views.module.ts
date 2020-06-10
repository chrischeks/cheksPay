import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EditModalComponent } from './modals/edit-modal/edit-modal.component';
import { FaqComponent } from './pages/general/faq/faq.component';
import { TermsComponent } from './pages/general/terms/terms.component';
import { RegisterCardsComponent } from './pages/lending/register-cards/register-cards.component';
import { RequestLoanComponent } from './pages/lending/request-loan/request-loan.component';
import { PayLoanComponent } from './pages/lending/pay-loan/pay-loan.component';
import { HomeComponent } from './pages/home/home.component';
import { NewAccountComponent } from './pages/banking/new-account/new-account.component';
import { CheckBalanceComponent } from './pages/banking/check-balance/check-balance.component';
import { ReferAFriendComponent } from './pages/general/refer-a-friend/refer-a-friend.component';
import { CustomerCareComponent } from './pages/general/customer-care/customer-care.component';
import { ProfileComponent } from './pages/general/profile/profile.component';
import { SettingsComponent } from './pages/general/settings/settings.component';
import { ManageLimitsComponent } from './pages/lending/manage-limits/manage-limits.component';
import { BillsComponent } from './pages/bills/bills.component';
import { AirtimeComponent } from './pages/airtime/airtime.component';
import { TransactionResultComponent } from './pages/transaction-result/transaction-result.component';
import { DataComponent } from './pages/data/data.component';
import { BankCardComponent } from './pages/bank-card/bank-card.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FundWalletComponent } from './pages/fund-wallet/fund-wallet.component';
import { LoanSchemesComponent } from './pages/loan-schemes/loan-schemes.component';
import { TransactionHistoryComponent } from './pages/general/transaction-history/transaction-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewLoanComponent } from './pages/lending/view-loan/view-loan.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from '../providers/http-interceptor.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k'
    }),
    CKEditorModule,
    ImageCropperModule,
    NgxPaginationModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    EditModalComponent,
    FaqComponent,
    TermsComponent,
    RegisterCardsComponent,
    RequestLoanComponent,
    PayLoanComponent,
    HomeComponent,
    NewAccountComponent,
    CheckBalanceComponent,
    ReferAFriendComponent,
    CustomerCareComponent,
    ProfileComponent,
    SettingsComponent,
    ManageLimitsComponent,
    BillsComponent,
    AirtimeComponent,
    TransactionResultComponent,
    DataComponent,
    BankCardComponent,
    ForgotPasswordComponent,
    FundWalletComponent,
    LoanSchemesComponent,
    TransactionHistoryComponent,
    ViewLoanComponent,
    TransferComponent
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [CurrencyPipe, { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }]

})
export class ViewsModule { }
