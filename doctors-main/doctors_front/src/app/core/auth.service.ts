import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthData } from './auth/auth-data.model';
import { io } from 'socket.io-client';
import { SnackbarService } from './services/snackbar.service';

const BACKEND_URL = 'http://localhost:3000/api/auth';
const PENDING_URL = 'http://localhost:3000/api/pending';
const DOCTOR_URL = 'http://localhost:3000/api/doctors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string = '';
  private tokenTimer: any;
  private userId: string = '';
  private authStatusListener = new Subject<boolean>();
  socket = io('ws://localhost:3030');

  private role: string = 'none';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  getToken() {
    return this.token;
  }

  getRole() {
    return this.role;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + '/register', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  createDoctor(
    email: string,
    password: string,
    name: string,
    position: string
  ) {
    const authData = {
      email: email,
      password: password,
      name: name,
      position: position,
    };
    console.log(authData);
    this.http.post(DOCTOR_URL + '/register', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  signupByToken(email: string, token: string) {
    this.http.get(PENDING_URL + '/check?email=' + email + '&token=' + token);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.role = 'patient';
            this.saveAuthData(token, expirationDate, this.userId, 'patient');
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  loginDoctor(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        DOCTOR_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.role = 'doctor';
            this.socket.emit('join', this.userId);
            this.saveAuthData(token, expirationDate, this.userId, 'doctor');
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId || '';
      this.role = authInformation.role || '';
      console.log(authInformation.role);
      if (this.role === 'doctor') {
        this.socket.emit('join', this.userId);
      }
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  data: BehaviorSubject<any>;

  getData(id: string) {
    return this.http.get<{
      first_name: string;
      second_name: string;
      id: string;
      avatar: any;
      position: string;
      description: string;
    }>(DOCTOR_URL + '/data/' + id);
  }

  getDoctorsChats(id: string) {
    return this.http.get<{ chats: any }>(DOCTOR_URL + '/chats/' + id);
  }

  getPatientChats(id: string) {
    return this.http.get<{
      chats: {
        chatId: string;
        mate: string;
      }[];
    }>(BACKEND_URL + '/chats/' + id);
  }

  getPatientsData(id?: string) {
    return this.http.get<{
      name: string;
      avatar: string;
      email: string;
    }>(BACKEND_URL + '/profile/' + id);
  }

  getProfileData() {
    if (this.role === 'doctor') {
      return this.http.get<{
        name: string;
        email: string;
        position: string;
        description: string;
        avatar: {
          public_id: string;
          url: string;
        };
      }>(DOCTOR_URL + '/profile/' + this.userId);
    } else {
      return this.http.get<{
        name: string;
        email: string;
        avatar: {
          public_id: string;
          url: string;
        };
      }>(BACKEND_URL + '/profile/' + this.userId);
    }
  }

  saveProfileData(userProfileData: any) {
    const URL = this.role === 'doctor' ? DOCTOR_URL : BACKEND_URL;
    console.log(userProfileData);
    return this.http
      .post<{ msg: string }>(URL + '/profile/' + this.userId, {
        id: this.userId,
        ...userProfileData,
      })
      .subscribe((res) => {
        this.snackBarService.openSnackBar(`Updated successfully`, 'ok');
      });
  }

  savePassword(password: string) {
    const URL = this.role === 'doctor' ? DOCTOR_URL : BACKEND_URL;
    console.log(password);
    return this.http
      .post<{ msg: string }>(URL + '/password', {
        id: this.userId,
        password: password,
      })
      .subscribe((res) => {
        this.snackBarService.openSnackBar(
          `Password has been updated successfully`,
          'ok'
        );
      });
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = '';
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    if (this.role === 'doctor') {
      this.socket.emit('leave', this.userId);
    }
    this.role = 'none';
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    role: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      role: role,
    };
  }
}
