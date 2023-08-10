import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthAdminService } from 'src/app/core/services/auth-admin.service';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthAdminLogGuard } from 'src/app/core/services/auth-admin-log-guard.service';

const routes: Routes = [
  {
    path: 'reg',
    component: AdminRegisterComponent,
  },
  {
    path: 'auth',
    component: AdminLoginComponent,
    canActivate: [AuthAdminLogGuard],
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [AuthAdminService],
  declarations: [AdminRegisterComponent, AdminLoginComponent],
})
export class AuthAdminModule {}
