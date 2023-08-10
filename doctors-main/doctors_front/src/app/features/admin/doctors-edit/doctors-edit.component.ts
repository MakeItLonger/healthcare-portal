import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Doctor } from 'src/app/core/models/doctor.model';
import { DoctorsService } from 'src/app/core/services/doctors.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-doctors-edit',
  templateUrl: './doctors-edit.component.html',
  styleUrls: ['./doctors-edit.component.scss'],
})
export class DoctorsEditComponent implements OnInit {
  doctorForm!: FormGroup;
  file!: File | null;

  isLoading$ = new BehaviorSubject<boolean>(false);

  workingDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  weekNumberList: number[] = [1, 2, 3, 4, 5];
  timeList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorsService: DoctorsService,
    private dialogRef: MatDialogRef<DoctorsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      position: ['', Validators.required],
      description: ['', Validators.required],
      avatar: ['', this.getAvatarValidators()],
      display: ['', this.getAvatarValidators()],
      appointmentDays: ['', Validators.required],
      timeSchedule: [[], Validators.required],
    });
    this.doctorForm.patchValue(this.data);
    this.generateTimeList(9, 18);
  }

  generateTimeList(startTime: number, endTime: number) {
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const time = this.formatTime(hour, minutes);
        this.timeList.push(time);
      }
    }
  }

  formatTime(hour: number, minutes: number) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinutes =
      minutes === 0 ? '00' : minutes.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinutes} ${period}`;
  }

  handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];

    this.file = file;

    this.doctorForm.patchValue({ display: file.name });
  }

  getAvatarValidators(): ValidatorFn[] {
    if (this.data) {
      return [];
    } else {
      return [Validators.required];
    }
  }

  onFormSubmit() {
    if (this.doctorForm.valid) {
      this.isLoading$.next(true);
      const doctorData = new FormData();
      doctorData.append('first_name', this.doctorForm.value.first_name);
      doctorData.append('second_name', this.doctorForm.value.second_name);
      doctorData.append('position', this.doctorForm.value.position);
      doctorData.append('description', this.doctorForm.value.description);
      doctorData.append(
        'appointmentDays',
        this.doctorForm.value.appointmentDays
      );
      doctorData.append('timeSchedule', this.doctorForm.value.timeSchedule);
      if (this.file) {
        doctorData.append('avatar', this.file, this.file.name);
      }

      if (this.data) {
        this.doctorsService.editDoctor(this.data._id, doctorData).subscribe({
          next: (doctor: Doctor) => {
            console.log(doctorData)
            this.isLoading$.next(false);
            this.snackBarService.openSnackBar(
              `Dr. ${doctor.first_name} ${doctor.second_name} has been updated successfully`,
              'ok'
            );
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else {
        this.doctorsService.addDoctor(doctorData).subscribe({
          next: (doctor: Doctor) => {
            this.snackBarService.openSnackBar(
              `Dr. ${doctor.first_name} ${doctor.second_name} has been added successfully`,
              'ok'
            );
            this.file = null;
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.file = null;
            this.dialogRef.close(true);
            console.error(err);
          },
        });
      }
    }
  }

  onCancelForm() {
    this.dialogRef.close();
  }
}
