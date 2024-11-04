// src/app/pages/dashboard/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from './dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://192.168.68.54:8000/api';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.API_URL}/api-dashbaord`);
  }
}
