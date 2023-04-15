import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MainService } from 'src/app/modules/main/services/main.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private mainService: MainService, private router: Router) { }

  canActivate(): boolean {
    const user = this.mainService.user;
    if(!(user && user.token)) {
      this.mainService.clearSession();
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
