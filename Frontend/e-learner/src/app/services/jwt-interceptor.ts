import { NewUserService } from './new-user.service';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpClient,
   HttpRequest, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public auth: NewUserService,
    private http: HttpClient,
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
    return next.handle(request).pipe(
      tap(
        {
          next:(event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              const url:string = 'http://127.0.0.1:8000/user/login/refresh/'

              this.http.post<any>(url, this.auth.refreshToken(), this.auth.getAuthInfo()).pipe(
                map(
                  res => {
                    localStorage.setItem('Token', res.access )
                  }
                )
              )

            }
          },
          error: (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                const url:string = 'http://127.0.0.1:8000/user/login/refresh/'

                this.http.post<any>(url, this.auth.refreshToken(), this.auth.getAuthInfo()).pipe(
                  map(
                    res => {
                      localStorage.setItem('Token', res.access )
                    }
                  )
                )
              }
            }
          }
        }
      )
    )
  }


}
