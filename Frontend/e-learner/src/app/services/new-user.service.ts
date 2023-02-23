import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { JwtToken } from './jwt-token';
import decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class NewUserService {

  constructor(
    private http: HttpClient,
  ) { }

  newUsers(user: any): Observable<any>{
    const url:string = 'http://127.0.0.1:8000/user/registration/'
    return this.http.post<any>(url, user, this.getAuthInfo())
  }

  getAuthInfo() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return { headers };
  }


  login(user: any): Observable<any>{
    const url:string = 'http://127.0.0.1:8000/user/login/'
    return this.http.post<any>(url, user, this.getAuthInfo()).pipe(
      map(
        res => {
          localStorage.setItem('Token', res.access )
          localStorage.setItem('Refresh', res.refresh )
          console.log(this.getAuthInfo())
        }
      )
    )
  }

  public getToken(): string|null {
    return localStorage.getItem('Token');
  }

  public refreshToken(): string|null {
    return localStorage.getItem('Refresh');
  }

}
