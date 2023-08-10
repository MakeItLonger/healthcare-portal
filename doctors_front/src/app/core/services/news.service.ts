import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QueryRequest } from '../models/query-request.model';

@Injectable()
export class NewsService {
  newsUrl = 'http://localhost:3000/api/news';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(this.newsUrl);
  }

  getNewsByQueryParams(
    queryRequest: QueryRequest
  ): Observable<{ news: News[]; total: number }> {
    const { search, sort, limit, page } = queryRequest;

    const params = new HttpParams()
      .set('search', search)
      .set('sort', sort.element + ',' + sort.direction)
      .set('limit', limit)
      .set('page', String(+page + 1));

    return this.http.get<{ news: News[]; total: number }>(this.newsUrl, {
      params,
    });
  }

  getLimitedNews(number: number): Observable<{ news: News[]; total: number }> {
    const params = new HttpParams().set('limit', number);

    return this.http.get<{ news: News[]; total: number }>(this.newsUrl, {
      params,
    });
  }

  addNews(formData: FormData): Observable<News> {
    return this.http.post<News>(this.newsUrl, formData);
  }

  editNews(id: number, formData: FormData): Observable<News> {
    return this.http.put<News>(`${this.newsUrl}/${id}`, formData);
  }

  deleteNews(id: number): Observable<News> {
    return this.http.delete<News>(`${this.newsUrl}/${id}`);
  }
}
