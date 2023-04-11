import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  constructor(private httpService: HttpService) { }

  logout(payload = {}) {
    return this.httpService.post('/logout', payload);
  }
}
