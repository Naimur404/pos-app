// exchange.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private apiUrl = 'YOUR_API_URL';

  constructor(private http: HttpClient,
    private apiService: ApiService
  ) {}

  getExchangeDetails(id: number): Observable<any> {
    return this.apiService.get(`exchange-details/${id}`);
  }
}
