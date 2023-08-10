import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QueryRequest } from '../models/query-request.model';

@Injectable()
export class DoctorsService {
  doctorsUrl = 'http://localhost:3000/api/doctors';

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.doctorsUrl);
  }

  getDoctorsByQueryParams(
    queryRequest: QueryRequest
  ): Observable<{ doctors: Doctor[]; total: number }> {
    const { search, sort, limit, page } = queryRequest;

    const params = new HttpParams()
      .set('search', search)
      .set('sort', sort.element + ',' + sort.direction)
      .set('limit', limit)
      .set('page', String(+page + 1));

    return this.http.get<{ doctors: Doctor[]; total: number }>(
      this.doctorsUrl,
      { params }
    );
  }

  getDoctorsByPosition(
    position: string
  ): Observable<{ doctors: Doctor[]; total: number }> {
    const params = new HttpParams().set('position', position);

    return this.http.get<{ doctors: Doctor[]; total: number }>(
      this.doctorsUrl,
      { params }
    );
  }

  getLimitedDoctors(
    number: number
  ): Observable<{ doctors: Doctor[]; total: number }> {
    const params = new HttpParams().set('limit', number);

    return this.http.get<{ doctors: Doctor[]; total: number }>(
      this.doctorsUrl,
      { params }
    );
  }

  addDoctor(formData: FormData): Observable<Doctor> {
    return this.http.post<Doctor>(this.doctorsUrl + "/register", formData);
  }

  editDoctor(id: string, formData: FormData): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.doctorsUrl}/${id}`, formData);
  }

  deleteDoctor(id: number): Observable<Doctor> {
    return this.http.delete<Doctor>(`${this.doctorsUrl}/${id}`);
  }
}
