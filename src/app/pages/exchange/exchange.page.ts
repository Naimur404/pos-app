import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

interface Customer {
  id: number;
  name: string;
  mobile: string;
  address: string;
  birth_date: string;
  outlet_id: number;
  points: number;
  due_balance: number;
  is_active: number;
}

interface Exchange {
  id: number;
  outlet_id: number;
  original_invoice_id: number;
  customer_id: number;
  grand_total: number;
  paid_amount: number;
  created_at: string;
  added_by: number;
  customer: Customer;
}

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  exchanges: Exchange[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  filteredExchanges: any[] = [];

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadExchanges();
  }

  async loadExchanges(event?: any) {
    if (!event) {
      const loading = await this.loadingCtrl.create({
        message: 'Loading exchanges...',
      });
      await loading.present();
    }

    this.apiService.get<any>('exchanges').subscribe({
      next: (response) => {
        this.exchanges = response.data.exchanges;
        if (event) {
          event.target.complete();
        } else {
          this.loadingCtrl.dismiss();
        }
      },
      error: (error) => {
        this.error = 'Failed to load exchanges';
        console.error('Error loading exchanges:', error);
        if (event) {
          event.target.complete();
        } else {
          this.loadingCtrl.dismiss();
        }
      }
    });
  }

  doRefresh(event: any) {
    this.loadExchanges(event);
  }

  addNewExchange() {
    // Implement navigation to add new exchange form
    this.router.navigate(['/exchange-products']);
  }

  retryLoad() {
    this.loadExchanges();
  }
  filterExchanges() {
    if (!this.searchTerm) {
      this.filteredExchanges = this.exchanges;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredExchanges = this.exchanges.filter(exchange =>
      exchange.original_invoice_id.toString().includes(searchLower) ||
      exchange.customer.name.toLowerCase().includes(searchLower)
    );
  }

  viewDetails(exchange: any) {
    // Navigate to details page or show modal
    this.router.navigate(['/exchange-details', exchange.id]);
    // Or if using modal:
    // this.modalCtrl.create({
    //   component: ExchangeDetailsComponent,
    //   componentProps: { exchange }
    // }).then(modal => modal.present());
  }
}
