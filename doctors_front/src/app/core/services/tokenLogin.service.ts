import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface pendingRegistration {
  name: string
  email: string
  token: string
}
@Injectable()
export class tokenLoginService {
  prUrl = 'http://localhost:3000/api/pending';

  constructor(private http: HttpClient) {}

  getAllPendingRegistrations(): Observable<pendingRegistration[]> {
    return this.http.get<pendingRegistration[]>(this.prUrl);
  }

  getLimitedPendingRegistrations(number: number): Observable<pendingRegistration[]> {
    const params = new HttpParams().set('limit', number);
    return this.http.get<pendingRegistration[]>(this.prUrl, { params });
  }

  createToken(email: string, name: string){
    return this.http.post(this.prUrl, {email: email, name: name}).subscribe()
  }

  checkToken(email: string, token: string): Observable<{invite: pendingRegistration, isValid: boolean; msg: string }>{
    return this.http.get(this.prUrl + '/check?email='+email+"&token="+token) as Observable<{invite: pendingRegistration, isValid: boolean, msg: string }>;
  }
}
