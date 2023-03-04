import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private http: HttpClient,
    ) {}


  getmaterial(): Observable<any>{
    return this.http.get<any>('http://localhost:8000/materials/')
  }

  postdata(formData:any): Observable<any>{
    console.log(formData)
    return this.http.post('http://localhost:8000/materials/', formData, {
      reportProgress: true,
      observe: 'events'
  })
  }
}
