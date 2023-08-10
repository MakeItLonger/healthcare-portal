import { Injectable } from '@angular/core';
import { CurrentAdmin } from '../models/currentAdmin.model';
import { RegisterAdmin } from '../models/registerAdmin.model';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginAdmin } from '../models/loginAdmin.model';

@Injectable()
export class AuthAdminService {
  authUrl = 'http://localhost:3000/api/admins';
  currentAdmin$ = new BehaviorSubject<CurrentAdmin | null | undefined>(
    undefined
  );

  isLogged$ = this.currentAdmin$.pipe(
    filter((currentAdmin) => {
      return currentAdmin !== undefined;
    }),
    map(Boolean)
  );

  constructor(private http: HttpClient) {}

  getCurrentAdmin(): Observable<CurrentAdmin> {
    return this.http.get<CurrentAdmin>(this.authUrl + '/admin');
  }

  register(adminRegData: RegisterAdmin): Observable<CurrentAdmin> {
    return this.http.post<CurrentAdmin>(this.authUrl, adminRegData);
  }

  login(adminLogData: LoginAdmin): Observable<CurrentAdmin> {
    return this.http.post<CurrentAdmin>(this.authUrl + '/login', adminLogData);
  }

  setToken(currentAdmin: CurrentAdmin): void {
    localStorage.setItem('tokenAdmin', currentAdmin.token);
  }

  setCurrentAdmin(currentAdmin: CurrentAdmin | null): void {
    this.currentAdmin$.next(currentAdmin);
  }
}
