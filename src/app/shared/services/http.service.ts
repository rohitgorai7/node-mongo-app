import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { MainService } from 'src/app/modules/main/services/main.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  get(url: string, params: {}) {
    return firstValueFrom(this.http.get(environment.apiUrl + url, {...(params? {params: params}: {}), ...this.getHeaders()}));
  }

  post(url: string, payload: any) {
    return firstValueFrom(this.http.post(environment.apiUrl + url, payload, {...this.getHeaders()}));
  }

  put(url: string, payload: any) {
    return firstValueFrom(this.http.put(environment.apiUrl + url, payload, {...this.getHeaders()}));
  }

  delete(url: string, params: {}) {
    return firstValueFrom(this.http.delete(environment.apiUrl + url, {...(params ? {params: params}: {}), ...this.getHeaders()}));
  }

  getHeaders() {
    const user = this.mainService.getUserData();
    return {
      ...{
        headers: new HttpHeaders({
          ...(user.token ? ({"x-access-token": user.token}) : {})
        })
      }
    }
  }
}
