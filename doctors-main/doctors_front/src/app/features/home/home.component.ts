import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from '../appointment/appointment.component';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  index = 0;

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private router: Router
  ) {}

  chatOpen = false;

  bookAppointment() {
    if (this.auth.getIsAuth()) {
      if (this.auth.getRole() === 'patient') {
        this.dialog.open(AppointmentComponent, {
          height: '700px',
          width: '700px',
          data: {
            index: this.index,
          },
        });
      }
    } else {
      this.router.navigateByUrl('/login').then();
    }
  }
}
