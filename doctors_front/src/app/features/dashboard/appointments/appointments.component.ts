import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth.service";
import {
  async,
  catchError,
  combineLatest,
  combineLatestAll, combineLatestWith, defaultIfEmpty,
  elementAt,
  forkJoin,
  Observable, of,
  Subscription,
  throwError
} from "rxjs";
import {AppointmentsService} from "../../../core/services/appointments.service";
import {MatDialog} from "@angular/material/dialog";
import {ReceiptComponent} from "../receipt/receipt.component";
import {debounceTime, map, switchMap} from "rxjs/operators";
import {Appointment} from "../../../core/models/appointment.model";
import {combineLatestInit} from "rxjs/internal/observable/combineLatest";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})

export class AppointmentsComponent implements OnInit, OnDestroy {

  appointments: any
  appointments$: Subscription
  displayedColumns: string[] = ['time', 'patientId', "menu"]

  constructor(private appointment: AppointmentsService, private auth: AuthService, public dialog: MatDialog) {
  }

  fetchApps = () => this.appointment.getAppointmentsByDoctorId(this.auth.getUserId(), this.date)
  fetchElement = (id?: string) => this.auth.getPatientsData(id)
  ids: any[] = []
  date: string

  onChange(){
    debounceTime(400)
    this.fetchAll()
  }


  fetchAll = () => {
    this.fetchApps().pipe(
      switchMap((ids) => {
        console.log(ids)
        this.ids = ids
        if(!ids){
          this.appointments = []
        }
        console.log(this.appointments);
        const elementObservables: any[] = ids.map((id) => this.fetchElement(id.patientId));
        return forkJoin(elementObservables).pipe(
          defaultIfEmpty([]),
          catchError((err) => {
            console.error('Error fetching elements:', err);
            return throwError(err);
          })
        );
      }),
      map((elements: Element[]) => {
        // Process elements and combine them with IDs
        return this.ids.map((id, index) => ({
          ...id,
          ...elements[index],
        }));
      })
    ).subscribe((combinedArray) => {
        this.appointments = combinedArray
    });
  }

  ngOnInit(): void {
    this.fetchAll()
  }



  ngOnDestroy(): void {
    if (this.appointments$) {
      this.appointments$.unsubscribe()
    }
  }

  log(any:any){
    console.log(any)
  }

  openDialog(id: string): void {
    console.log(id)
    this.dialog.open(ReceiptComponent, {
      data: {id: id}
    });
  }
}
