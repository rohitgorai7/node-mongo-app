import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  user: any = {
    name: '',
    email: '',
    username: '',
    token: '',
    userId: '',
    userType: '',
    isLoggedIn: false
  };
  user$: Subject<any> = new Subject<any>();

  constructor() {
    this.user$.subscribe((data) => {
      this.user = data;
    });
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if(user)
    this.user$.next(user);
  }
  
  clearSession() {
    localStorage.clear();
    sessionStorage.clear();
  }

  setUser(userData: any = {}) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    this.user$.next(userData);
  }
}
