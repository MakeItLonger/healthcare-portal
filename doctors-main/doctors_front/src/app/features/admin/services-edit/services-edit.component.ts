import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Service } from 'src/app/core/models/service.model';
import { ServicesService } from 'src/app/core/services/services.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss'],
})
export class ServicesEditComponent implements OnInit {
  serviceForm!: FormGroup;
  file!: File | null;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private dialogRef: MatDialogRef<ServicesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      picture: ['', this.getAvatarValidators()],
      display: ['', this.getAvatarValidators()],
    });
    this.serviceForm.patchValue(this.data);
  }

  handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];

    this.file = file;

    this.serviceForm.patchValue({ display: file.name });
  }

  getAvatarValidators(): ValidatorFn[] {
    if (this.data) {
      return [];
    } else {
      return [Validators.required];
    }
  }

  onFormSubmit() {
    if (this.serviceForm.valid) {
      this.isLoading$.next(true);
      const serviceData = new FormData();
      serviceData.append('title', this.serviceForm.value.title);
      if (this.file) {
        serviceData.append('picture', this.file, this.file.name);
      }

      if (this.data) {
        this.servicesService.editService(this.data._id, serviceData).subscribe({
          next: (service: Service) => {
            this.isLoading$.next(false);
            this.snackBarService.openSnackBar(
              `Service ${service.title} has been updated successfully`,
              'ok'
            );
            this.dialogRef.close(true);
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
          },
        });
      } else {
        this.servicesService.addService(serviceData).subscribe({
          next: (service: Service) => {
            this.snackBarService.openSnackBar(
              `Service ${service.title} has been added successfully`,
              'ok'
            );
            this.file = null;
            this.dialogRef.close(true);
          },
          error: (err: HttpErrorResponse) => {
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
