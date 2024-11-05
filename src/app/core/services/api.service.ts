import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
interface RequestOptions {
  params?: any;
  headers?: any;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}



  get<T>(endpoint: string, options: RequestOptions = {}): Observable<T> {
      const url = this.apiConfig.getFullUrl(endpoint);
      return this.http.get<T>(url, options);
  }
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.apiConfig.getFullUrl(endpoint), data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.apiConfig.getFullUrl(endpoint), data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.apiConfig.getFullUrl(endpoint));
  }
}
