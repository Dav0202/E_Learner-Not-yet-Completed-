import { NewUserService } from './new-user.service';
import {
  HttpInterceptor, HttpHandler, HttpEvent, HttpClient,
  HttpRequest, HttpHeaders, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { tap, shareReplay, map, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from "rxjs";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  constructor(
    public auth: NewUserService,
    private http: HttpClient,
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true,
    });
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('login') &&
          error.status === 401
        ) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      let loggedin = this.auth.getToken()
      if (loggedin) {
        console.log('come on')
        return this.auth.refreshToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403' && error.status == '401') {
              this.auth.logout()
            }
            return throwError(() => error);
          })
        );
      }

    }
    return next.handle(request);
    }
}
