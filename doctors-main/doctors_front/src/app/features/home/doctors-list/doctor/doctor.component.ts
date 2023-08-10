import { Component, Input } from '@angular/core';
import { Doctor } from 'src/app/core/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from 'src/app/features/appointment/appointment.component';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent {
  @Input() doctor!: Doctor;
  index = 2;

  constructor(private dialog: MatDialog) {}

  bookAppointment() {
    this.dialog.open(AppointmentComponent, {
      height: '700px',
      width: '700px',
      data: {
        index: this.index,
        doctor: this.doctor,
      },
    });
  }
}
