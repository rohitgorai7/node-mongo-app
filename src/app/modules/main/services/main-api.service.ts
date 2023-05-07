import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class MainApiService {

  constructor(private httpService: HttpService) { }

  signup(payload = {}) {
    return  this.httpService.post('/signup', payload);
  }

  getUsers(params = {}) {
    return this.httpService.get('/get-users', params);
  }

  getChatUsers(params = {}) {
    return this.httpService.get('/get-chat-users', params);
  }

  login(payload = {}) {
    return this.httpService.post('/login', payload);    
  }
}
