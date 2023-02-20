import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewUserService {

  constructor(
    private http: HttpClient,
  ) { }

  newUsers(user: any): Observable<any>{
    const url:string = 'http://127.0.0.1:8000/rest-auth/registration/'
    return this.http.post<any>(url, user, this.getAuthInfo())
  }

  getAuthInfo() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return { headers };
  }
}
