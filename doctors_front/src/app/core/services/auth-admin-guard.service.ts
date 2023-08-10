import { Router } from '@angular/router';
import { AuthAdminService } from './auth-admin.service';
import { filter, map } from 'rxjs';
import { inject } from '@angular/core';

export const AuthAdminGuard = () => {
  const currentUserService = inject(AuthAdminService);
  const router = inject(Router);

  return currentUserService.currentAdmin$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => {
      if (!currentUser) {
        router.navigateByUrl('/admin/auth');
        return false;
      }
      return true;
    })
  );
};
