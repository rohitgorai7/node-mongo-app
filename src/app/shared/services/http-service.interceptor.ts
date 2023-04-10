import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MainService } from 'src/app/modules/main/services/main.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpServiceInterceptor implements HttpInterceptor {

  constructor(private mainService: MainService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const env = this;
    const clonedUrl = request.clone({
      url: env.fixUrl(request.url),
    });
    return next.handle(clonedUrl).pipe(
      tap(
        event => {},
        error => {
          if(error["status"] === 401) {
            this.mainService.clearSession();
            if(error.url.indexOf('login') === -1){
              this.router.navigate(['/']);
            }
          }
        }
      )
    )
  }

  fixUrl(url: string = '') {
    return url;
  }
}
