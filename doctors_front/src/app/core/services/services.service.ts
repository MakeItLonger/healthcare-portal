import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QueryRequest } from '../models/query-request.model';

@Injectable()
export class ServicesService {
  servicesUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<{ services: Service[]; total: number }> {
    return this.http.get<{ services: Service[]; total: number }>(
      this.servicesUrl
    );
  }

  getServicesByQueryParams(
    queryRequest: QueryRequest
  ): Observable<{ services: Service[]; total: number }> {
    const { search, sort, limit, page } = queryRequest;

    const params = new HttpParams()
      .set('search', search)
      .set('sort', sort.element + ',' + sort.direction)
      .set('limit', limit)
      .set('page', String(+page + 1));

    return this.http.get<{ services: Service[]; total: number }>(
      this.servicesUrl,
      {
        params,
      }
    );
  }

  getLimitedServices(
    number: number
  ): Observable<{ services: Service[]; total: number }> {
    const params = new HttpParams().set('limit', number);

    return this.http.get<{ services: Service[]; total: number }>(
      this.servicesUrl,
      {
        params,
      }
    );
  }

  addService(formData: FormData): Observable<Service> {
    return this.http.post<Service>(this.servicesUrl, formData);
  }

  editService(id: number, formData: FormData): Observable<Service> {
    return this.http.put<Service>(`${this.servicesUrl}/${id}`, formData);
  }

  deleteService(id: number): Observable<Service> {
    return this.http.delete<Service>(`${this.servicesUrl}/${id}`);
  }
}
