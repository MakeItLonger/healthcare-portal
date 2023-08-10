import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AppointmentsService {
  appointmentsUrl = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.appointmentsUrl);
  }

  getAppointmentsByQueryParams(
    doctorId: string,
    date: string
  ): Observable<Appointment[]> {
    const params = new HttpParams().set('doctorId', doctorId).set('date', date);

    return this.http.get<Appointment[]>(this.appointmentsUrl, { params });
  }

  getAppointmentsByDoctorId(
    doctorId: string,
    date: string
  ): Observable<Appointment[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId)
      .set('date', date);

    return this.http.get<Appointment[]>(this.appointmentsUrl, { params });
  }

  addAppointment(formData: FormData): Observable<Appointment> {
    return this.http.post<Appointment>(this.appointmentsUrl, formData);
  }

  editAppointment(id: number, formData: FormData): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.appointmentsUrl}/${id}`,
      formData
    );
  }

  deleteAppointment(id: number): Observable<Appointment> {
    return this.http.delete<Appointment>(`${this.appointmentsUrl}/${id}`);
  }
}
