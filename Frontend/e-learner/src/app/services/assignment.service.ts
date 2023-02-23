import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(
    private http: HttpClient
  ) { }

  getAssignment():Observable<any>{
    const headers2 = {
      'Content-Type': 'application/json',
    }
    const requestoption = {
        headers : new HttpHeaders(headers2)
    }
    const url2:string = `http://127.0.0.1:8000/assignments/`
    return this.http.get( url2, requestoption)
  }

  getAssignmentDetail(id:number):Observable<any>{
    const headers2 = {
      'Content-Type': 'application/json',
    }
    const requestoption = {
        headers : new HttpHeaders(headers2)
    }
    const url2:string = `http://127.0.0.1:8000/assignments/${id}`
    return this.http.get( url2, requestoption)
  }
}
