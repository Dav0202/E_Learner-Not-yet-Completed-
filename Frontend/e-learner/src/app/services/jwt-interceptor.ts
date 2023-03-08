import { EventBusService } from './event-bus.service';
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
    private eventbusservice: EventBusService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    request = request.clone({
      withCredentials: true,
    });
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403) {
            console.log('error 403')
            this.auth.refreshToken().subscribe()

          } //else if (err.status === 401){
            //console.log('error 401')

          //}else{
          //  console.log('error all errors')
          //  this.auth.logout()
          //}
        }
        return throwError(() => err);
      })
    );
  }


}
