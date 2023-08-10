import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../../core/services/services.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent {
  constructor(private servicesService: ServicesService) {}

  services$ = this.servicesService
    .getAllServices()
    .pipe(map((res) => res.services));
}
