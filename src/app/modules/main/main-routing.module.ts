import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'login'},
  {path: 'signup', pathMatch: 'full', component: SignupComponent},
  {path: 'forgot-password', pathMatch: 'full', component: ForgotPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
