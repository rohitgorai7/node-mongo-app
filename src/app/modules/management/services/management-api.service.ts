import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementApiService {

  constructor(private http: HttpService) { }

  updateUser(payload = {}) {
    return this.http.post('/update-user', payload);
  }
}
