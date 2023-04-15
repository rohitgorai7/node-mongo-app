import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  showPassword(event: any) {
    if(event.type === 'password') {
      event.type = 'text';
    } else {
      event.type = 'password';
    }
  }
}
