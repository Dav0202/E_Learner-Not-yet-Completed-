import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private http: HttpClient,
    ) {}
  private baseUrl = 'http://localhost:8000/materials/';

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    console.log(formData)

    const req = new HttpRequest('POST', `${this.baseUrl}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  postdata(formData:any): Observable<any>{
    console.log(formData)
    return this.http.post('http://localhost:8000/materials/', formData, {
      reportProgress: true,
      observe: 'events'
  })
  }
}
