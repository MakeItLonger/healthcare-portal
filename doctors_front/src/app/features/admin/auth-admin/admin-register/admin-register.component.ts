import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAdminService } from 'src/app/core/services/auth-admin.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss'],
})
export class AdminRegisterComponent {
  errorMessage: string | null = null;

  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authAdminService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.authAdminService.register(this.registrationForm.value).subscribe({
      next: (currentAdmin) => {
        this.authAdminService.setToken(currentAdmin);
        this.authAdminService.setCurrentAdmin(currentAdmin);
        this.errorMessage = null;
        this.router.navigateByUrl('/admin');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error.join(', ');
      },
    });
  }
}
