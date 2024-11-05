import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../../core/services/api.service';

interface SalesReturn {
  id: number;
  outlet_id: number;
  customer_id: number;
  sale_date: string;
  sub_total: number;
  vat: number;
  delivery_charge: number;
  total_discount: number;
  grand_total: number;
  total_with_charge: number;
  payable_amount: number;
  given_amount: number;
  paid_amount: number;
  due_amount: number;
  earn_point: number;
  redeem_point: number | null;
  payment_method_id: number;
  is_exchange: number;
  added_by: number;
}

interface SaleDetail {
  id: number;
  outlet_invoice_id: number;
  stock_id: number;
  medicine_id: number;
  medicine_name: string;
  size: string;
  create_date: string | null;
  available_qty: number;
  quantity: number;
  rate: number;
  discount: number;
  total_price: number;
  remarks: string | null;
  is_exchange: number;
}

interface InvoiceDetails {
  salesReturn: SalesReturn;
  saleDetails: SaleDetail[];
}
interface User {
  name: any;
  id: any;
  email: string;
  outlet_id: any;
}

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.page.html',
  styleUrls: ['./invoice-details.page.scss']
})
export class InvoiceDetailsPage implements OnInit {
  invoiceDetails: InvoiceDetails | null = null;
  isLoading = false;
  error: string | null = null;
  user: User | any = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private loadingController: LoadingController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.fetchInvoiceDetails(params['id']);
      }
    });
  }

  async fetchInvoiceDetails(invoiceId: number) {
    try {
      const loading = await this.loadingController.create({
        message: 'Loading invoice details...',
        duration: 3000
      });
      await loading.present();
      this.isLoading = true;

      this.apiService.get<any>(`/invoice-details/${invoiceId}`)
        .subscribe(
          (response) => {
            this.invoiceDetails = response;
            this.isLoading = false;
            loading.dismiss();
          },
          (error) => {
            console.error('Error fetching invoice details:', error);
            this.error = 'Failed to load invoice details';
            this.isLoading = false;
            loading.dismiss();
          }
        );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'An unexpected error occurred';
      this.isLoading = false;
    }
  }

  getPaymentMethodName(id: number): string {
    const methods: { [key: number]: string } = {
      1: 'Cash',
      2: 'Card',
      3: 'Mobile Banking'
    };
    return methods[id] || 'Unknown';
  }


}
