import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  currentChatData: any;

  constructor() { }

  showPassword(event: any) {
    if(event.type === 'password') {
      event.type = 'text';
    } else {
      event.type = 'password';
    }
  }
}
