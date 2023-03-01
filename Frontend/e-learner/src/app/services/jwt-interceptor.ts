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
      withCredentials: true,
    });
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
    return next.handle(request).pipe(
      //tap(
      //  (
      //    ((ev: HttpEvent<any>) => {
      //      console.log("got an event",ev)
      //      if (ev instanceof HttpResponse) {
      //        console.log('event of type response', ev);}
      //  }
      //  )
      //)
      //)
    )
  }
}
