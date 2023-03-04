import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { JwtToken } from './jwt-token';
import decode from 'jwt-decode';
import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root'
})
export class NewUserService {
  encryptMode: boolean
  textToConvertstudent!: any;
  textToConverteducator!: any;
  decrypttextToConvertstudent!: any;
  decrypttextToConverteducator!: any;
  private password!: any;
  conversionOutputstudent!: any;
  conversionOutputeducator!: any;
  conversionOutputemail!: any;
  decryptconversionOutputstudent!: any;
  decryptconversionOutputeducator!: any;
  decryptconversionOutputemail!: any;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router
  ) {
    this.encryptMode = true
  }

  private jwtToken!: JwtToken
  private refreshTokenTimeout!: NodeJS.Timeout;

  newUsers(user: any): Observable<any> {
    const headers2 = {
      'Content-Type': 'application/json',
    }
    const requestoption = {
      headers: new HttpHeaders(headers2)
    }
    const url: string = 'http://localhost:8000/user/registration/'
    return this.http.post<any>(url, user, requestoption)
  }


  login(user: any): Observable<any> {
    const url: string = 'http://localhost:8000/user/login/'
    const headers2 = {
      'Content-Type': 'application/json',
    }
    const requestoption = {
      headers: new HttpHeaders(headers2)
    }
    return this.http.post<any>(url, user, httpOptions).pipe(
      map(
        res => {
          this.setText()
          this.jwtToken = decode(res.access)
          console.log(this.jwtToken)
          localStorage.setItem('Token', res.access)
          localStorage.setItem('exp', JSON.stringify(this.jwtToken.exp))
          this.encryptMode = true;
          this.conversionOutputemail = CryptoJS.AES.encrypt(JSON.stringify(this.jwtToken.email), this.cookie.get("RTY_ft")).toString();
          this.conversionOutputeducator = CryptoJS.AES.encrypt(JSON.stringify(this.jwtToken.educator), this.cookie.get("RTY_ft")).toString();
          this.conversionOutputstudent = CryptoJS.AES.encrypt(JSON.stringify(this.jwtToken.student), this.cookie.get("RTY_ft")).toString();

          this.cookie.set('student', this.conversionOutputstudent);
          this.cookie.set('educator', this.conversionOutputeducator);
          this.cookie.set('oYkhyT', this.conversionOutputemail); //email
          this.router.navigate(['/', 'homepage'])
        }
      )
    )
  }



  public getToken(): string | null | undefined | void {
    let token = localStorage.getItem('Token');
    if (token) {
      return localStorage.getItem('Token');
    }
  }

  islogged(){
    let token = localStorage.getItem('Token');
    //let recentTime = Date.now()
    //let exp = localStorage.getItem('exp')
    //let expired = new Date(JSON.parse(exp!))
    if (token) {
      return true
    }
    return false
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['/', 'homepage'])
  }



  setText() {
    this.cookie.set('RTY_ft', uuidv4())
  }


  toDecryptStudentEducator() {
    this.encryptMode = false;
    this.decryptconversionOutputstudent = CryptoJS.AES.decrypt(this.cookie.get("student"),
      this.cookie.get("RTY_ft")).toString(CryptoJS.enc.Utf8);
    this.decryptconversionOutputeducator = CryptoJS.AES.decrypt(this.cookie.get("educator"),
      this.cookie.get("RTY_ft")).toString(CryptoJS.enc.Utf8);
    this.decryptconversionOutputemail = CryptoJS.AES.decrypt(this.cookie.get("oYkhyT"),
      this.cookie.get("RTY_ft")).toString(CryptoJS.enc.Utf8);
    return {
      'educator': this.decryptconversionOutputeducator,
      'student': this.decryptconversionOutputstudent,
      'email': this.decryptconversionOutputemail
    }
  }

  refreshToken() {
    return this.http.post<any>('http://localhost:8000/user/login/refresh/', {}, { withCredentials: true })
      .pipe(map((res) => {
        console.log('Access Token expired Refresh begin')
        this.jwtToken = decode(res.access)
        localStorage.setItem('Token', res.access)
        this.startRefreshTokenTimer();
      }));
  }

checkexp(){
  let expires = new Date(JSON.parse(localStorage.getItem('exp')!))
  let recentTime = Date.now()
  let timeout = expires.getTime() - recentTime;
  if (
    (recentTime/1000 >= expires.getTime())
    ) {
    console.log(JSON.parse(localStorage.getItem('exp')!))
    return true
  }
  return false
}

  startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    //const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
    //const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires

    let expires = new Date(JSON.parse(localStorage.getItem('exp')!) * 1000)
    let recentTime = Date.now() - (60 * 1000)
    let timeout = expires.getTime() - recentTime;
    console.log(timeout, new Date(recentTime), expires)
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  setteacher(){
    let decryptcookies = this.toDecryptStudentEducator()
    if (decryptcookies.educator === "true" && decryptcookies.student === "false") {
      return true
    }
    return false
  }

}
