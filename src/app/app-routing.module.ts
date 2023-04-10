import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  {path: '', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)},
  {path: 'management', canActivate: [AuthGuardService], loadChildren: () => import('./modules/management/management.module').then(m => m.ManagementModule)},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
