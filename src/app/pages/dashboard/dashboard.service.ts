// src/app/pages/dashboard/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, TopSale } from './dashboard.interface';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // private readonly API_URL = 'http://192.168.68.54:8000/api';

  constructor(private http: HttpClient,
    private apiService: ApiService
  ) {}

  getDashboardData(): Observable<DashboardData> {
    return this.apiService.get<DashboardData>(`api-dashbaord`);
  }
  getTopSlaeData(): Observable<TopSale[]> {
    return this.apiService.get<TopSale[]>(`top-sale`);
  }
}
