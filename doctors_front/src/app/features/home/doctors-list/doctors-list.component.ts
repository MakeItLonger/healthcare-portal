import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { DoctorsService } from 'src/app/core/services/doctors.service';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss'],
})
export class DoctorsListComponent {
  doctors$ = this.doctorsService
    .getLimitedDoctors(4)
    .pipe(map((res) => res.doctors));

  constructor(private doctorsService: DoctorsService) {}
}
