import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAdminService } from 'src/app/core/services/auth-admin.service';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  errorMessage: string | null = null;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authAdminService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.authAdminService.login(this.loginForm.value).subscribe({
      next: (currentAdmin) => {
        this.authAdminService.setToken(currentAdmin);
        this.authAdminService.setCurrentAdmin(currentAdmin);
        this.errorMessage = null;
        this.router.navigate(['/admin']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error.emailOrPassword;
      },
    });
  }
}
