// exchange.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,

    private apiService: ApiService
  ) {}

  getExchangeProducts(invoiceId: string): Observable<any> {
    return this.apiService.get(`exchange-products/${invoiceId}`);
  }

  searchProducts(term: string): Observable<any> {
    return this.apiService.get(`product`, {
      params: { search: term }
    });
  }

  submitExchange(payload: any): Observable<any> {
    return this.apiService.post(`/submit-exchange`, payload);
  }
}
