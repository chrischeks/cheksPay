import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { NotFoundComponent } from './views/errors/not-found/not-found.component';
import { HomeComponent } from './views/pages/home/home.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { FaqComponent } from './views/pages/general/faq/faq.component';
import { TermsComponent } from './views/pages/general/terms/terms.component';
import { RegisterCardsComponent } from './views/pages/lending/register-cards/register-cards.component';
import { RequestLoanComponent } from './views/pages/lending/request-loan/request-loan.component';
import { PayLoanComponent } from './views/pages/lending/pay-loan/pay-loan.component';
import { ManageLimitsComponent } from './views/pages/lending/manage-limits/manage-limits.component';
import { CheckBalanceComponent } from './views/pages/banking/check-balance/check-balance.component';
import { NewAccountComponent } from './views/pages/banking/new-account/new-account.component';
import { CustomerCareComponent } from './views/pages/general/customer-care/customer-care.component';
import { SettingsComponent } from './views/pages/general/settings/settings.component';
import { ProfileComponent } from './views/pages/general/profile/profile.component';
import { ReferAFriendComponent } from './views/pages/general/refer-a-friend/refer-a-friend.component';
import { AuthGuardService as AuthGuard } from './guards/auth-guard.service';
import { RoleGuardService as RoleGuard } from './guards/role-guard.service';
import { BillsComponent } from './views/pages/bills/bills.component';
import { AirtimeComponent } from './views/pages/airtime/airtime.component';
import { TransactionResultComponent } from './views/pages/transaction-result/transaction-result.component';
import { DataComponent } from './views/pages/data/data.component';
import { BankCardComponent } from './views/pages/bank-card/bank-card.component';
import { ForgotPasswordComponent } from './views/pages/forgot-password/forgot-password.component';
import { FundWalletComponent } from './views/pages/fund-wallet/fund-wallet.component';
import { LoanSchemesComponent } from './views/pages/loan-schemes/loan-schemes.component';
import { TransactionHistoryComponent } from './views/pages/general/transaction-history/transaction-history.component';
import { ViewLoanComponent } from './views/pages/lending/view-loan/view-loan.component';
import { ViewLoanResolverService } from './providers/view-loan.resolver';
import { TransferComponent } from './views/pages/transfer/transfer.component';
const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'pages', canActivate:[AuthGuard], children:
      [
        { path: 'home', component: HomeComponent},
        { path: 'faq', component: FaqComponent },
        { path: 'terms', component: TermsComponent },
        { path: 'register-cards', component: RegisterCardsComponent },
        { path: 'request-loan', component: RequestLoanComponent },
        { path: 'pay-loan/card/:loanId', component: PayLoanComponent },
        { path: 'check-balance', component: CheckBalanceComponent },
        { path: 'new-account', component: NewAccountComponent },
        { path: 'customer-care', component: CustomerCareComponent },
        { path: 'settings', component: SettingsComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'refer-a-friend', component: ReferAFriendComponent },
        { path: 'manage-limits', component: ManageLimitsComponent },
        { path: 'pay-bills', component: BillsComponent },
        { path: 'buy-airtime', component: AirtimeComponent},
        { path: 'transaction-result/:ref', component: TransactionResultComponent },
        { path: 'buy-data', component: DataComponent },
        { path: 'cards', component: BankCardComponent },
        { path: 'fund-wallet', component: FundWalletComponent },
        { path: 'loan-schemes', component: LoanSchemesComponent },
        { path: 'view-loan/:id', component: ViewLoanComponent, resolve:{loan: ViewLoanResolverService} },
        {path:'transaction-history', component: TransactionHistoryComponent},
        {path:'transfer', component: TransferComponent}

      ]
  },
  { path: '**', component: NotFoundComponent },

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
