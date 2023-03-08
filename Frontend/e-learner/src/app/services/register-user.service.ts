import { Injectable } from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private httpClient: HttpClient;
  constructor(
    private handler: HttpBackend,
  ) {
    this.httpClient = new HttpClient(handler);
  }


  newUsers(user: any): Observable<any> {
    const headers2 = {
      'Content-Type': 'application/json',
    }
    const requestoption = {
      headers: new HttpHeaders(headers2)
    }
    const url: string = 'http://localhost:8000/user/registration/'
    return this.httpClient.post<any>(url, user, requestoption)
  }

}
