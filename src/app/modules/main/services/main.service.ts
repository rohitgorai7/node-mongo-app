import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor() { }

  clearSession() {
    localStorage.clear();
    sessionStorage.clear();
  }

  setSessionStorage(userData: any = {}) {
    sessionStorage.setItem('user', JSON.stringify(userData.user));
  }

  getUserData() {
    return JSON.parse(sessionStorage.getItem('user') || '{}');
  }
}
