import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Appointment } from 'src/app/core/models/appointment.model';
import { Doctor } from 'src/app/core/models/doctor.model';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { DoctorsService } from 'src/app/core/services/doctors.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from '../../core/auth.service';
import { formatDate } from '../../shared/utils/formatDate';

enum Position {
  Neurologist = 'Neurologist',
  Psychiatrist = 'Psychiatrist',
  Pediatrician = 'Pediatrician',
  Dermatologist = 'Dermatologist',
  Diagnostician = 'Diagnostician',
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  @ViewChild('stepper', { static: true }) stepper!: MatStepper;

  stepperMode = true;

  destroyed = new Subject();

  form: FormGroup = this.fb.group({
    position: ['', Validators.required],
    doctor: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
  });

  today = new Date();
  tomorrow = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  twoWeeks = new Date(this.tomorrow.getTime() + 14 * 24 * 60 * 60 * 1000);

  currentAppointment?: Appointment;

  doctors$: Observable<Doctor[]> = this.form.controls[
    'position'
  ].valueChanges.pipe(
    filter(Boolean),
    switchMap((position: Position) =>
      this.doctorsService.getDoctorsByPosition(position).pipe(
        map((res) => {
          return res.doctors;
        })
      )
    )
  );

  schedule$: Observable<string[]> = this.form.controls[
    'date'
  ].valueChanges.pipe(
    filter(Boolean),
    switchMap((date: Date) => this.getFreeTimePerDay(date))
  );

  appointmentsByCurrentDoctor: Appointment[] = [];

  fieldsOfMedicine = [
    { value: Position.Neurologist, viewValue: 'Neurology' },
    { value: Position.Psychiatrist, viewValue: 'Psychiatry' },
    { value: Position.Pediatrician, viewValue: 'Pediatrics' },
    { value: Position.Dermatologist, viewValue: 'Dermatology' },
    { value: Position.Diagnostician, viewValue: 'Diagnostic' },
  ];

  constructor(
    private fb: FormBuilder,
    private doctorsService: DoctorsService,
    private appointmentsService: AppointmentsService,
    private dialogRef: MatDialogRef<AppointmentComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get currentDoctor(): Doctor {
    return this.form.controls['doctor'].value;
  }

  ngOnInit(): void {
    if (this.data.doctor) {
      this.stepperMode = false;
      this.form.patchValue({ doctor: this.data.doctor });
    }

    this.form.controls['doctor'].valueChanges
      .pipe(
        takeUntil(this.destroyed),
        filter(Boolean),
        switchMap(({ _id }) =>
          this.appointmentsService.getAppointmentsByDoctorId(
            _id,
            formatDate(this.tomorrow)
          )
        )
      )
      .subscribe((data) => {
        this.appointmentsByCurrentDoctor = data;
      });

    this.stepper.selectedIndex = this.data.index;
  }

  filterAvaliableDays = (d: Date | null): boolean => {
    if (!this.currentDoctor) return false;
    const factAmountOfAppointmentsPerDay =
      this.appointmentsByCurrentDoctor.filter((appointment: Appointment) => {
        return appointment.date === formatDate(d);
      }).length;

    const day = (d || new Date()).getDay();
    let isIncludedDay;

    if (typeof this.currentDoctor.appointmentDays === 'string') {
      isIncludedDay = this.currentDoctor.appointmentDays
        .split(',')
        .includes(String(day));
    }

    if (!isIncludedDay) {
      return false;
    }

    return (
      isIncludedDay &&
      factAmountOfAppointmentsPerDay !== this.plannedAppointmentsPerDayAmount
    );
  };

  get plannedAppointmentsPerDayAmount(): number {
    return this.currentDoctor.timeSchedule.split(',').length;
  }

  getFreeTimePerDay(date: Date): Observable<string[]> {
    const doctorId = this.currentDoctor._id;
    const dailyAppointments = this.currentDoctor.timeSchedule.split(',');
    return this.appointmentsService
      .getAppointmentsByQueryParams(doctorId ?? '', formatDate(date))
      .pipe(
        map((appointments) => {
          const makedAppointments = appointments.map((appointment) => {
            return appointment.time;
          });

          return dailyAppointments.filter((time) => {
            return !makedAppointments.includes(time);
          });
        })
      );
  }

  confirmAppointment() {
    const appointmentData = new FormData();

    if (!this.currentDoctor._id) return;

    appointmentData.append('doctorId', this.currentDoctor._id);
    appointmentData.append('patientId', this.auth.getUserId());
    appointmentData.append(
      'date',
      formatDate(this.form.controls['date'].value)
    );
    appointmentData.append('time', this.form.controls['time'].value);

    this.appointmentsService.addAppointment(appointmentData).subscribe({
      next: (appointment: Appointment) => {
        this.currentAppointment = appointment;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  closeDialog() {
    this.destroyed.next(true);
    this.dialogRef.close(true);
  }
}
