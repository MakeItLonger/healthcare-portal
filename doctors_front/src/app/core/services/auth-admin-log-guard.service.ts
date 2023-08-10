import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminLogGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('tokenAdmin');

    if (token) {
      this.router.navigateByUrl('/admin');
      return false;
    }

    return true;
  }
}
