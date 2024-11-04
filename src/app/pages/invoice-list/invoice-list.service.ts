import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice, InvoiceResponse } from './invoice-list.interfaces';

@Injectable({
  providedIn: 'root'
})
export class InvoiceListService {
  private readonly API_URL = 'http://192.168.68.54:8000/api';

  constructor(private http: HttpClient) {}

  getInvoices(
    page: number,
    perPage: number,
    search?: string,
    paymentMethod?: string
  ): Observable<InvoiceResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (paymentMethod) {
      params = params.set('payment_method', paymentMethod);
    }

    return this.http.get<InvoiceResponse>(`${this.API_URL}/all-invoice`, { params })
      .pipe(
        map(response => {
          if (!response) {
            return {
              status: 'error',
              data: [],
              total_records: 0
            };
          }
          return response;
        })
      );
  }
  
}
