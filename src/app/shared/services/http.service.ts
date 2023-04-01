import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  get(url: string, params: {}) {
    return firstValueFrom(this.http.get(environment.apiUrl + url, params));
  }

  post(url: string, payload: any) {
    return firstValueFrom(this.http.post(environment.apiUrl + url, payload));
  }

  put(url: string, payload: any) {
    return firstValueFrom(this.http.put(environment.apiUrl + url, payload));
  }

  delete(url: string, payload: any) {
    return firstValueFrom(this.http.delete(environment.apiUrl + url, payload));
  }
}
