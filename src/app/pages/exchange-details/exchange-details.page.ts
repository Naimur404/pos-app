// exchange-details.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ExchangeService } from './exchnage-details.service';
interface ExchangeDetail {
  id: number;
  outlet_exchange_id: number;
  medicine_id: number;
  medicine_name: string;
  size: string;
  available_qty: number;
  quantity: number;
  rate: number;
  total_price: number;
  is_exchange: number;
}

@Component({
  selector: 'app-exchange-details',
  templateUrl: './exchange-details.page.html',
  styleUrls: ['./exchange-details.page.scss'],
})


export class ExchangeDetailsPage implements OnInit {
  exchangeData: any;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private exchangeService: ExchangeService
  ) {}

  ngOnInit() {
    this.loadExchangeDetails();
  }

  async loadExchangeDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.exchangeService.getExchangeDetails(Number(id)).subscribe({
        next: (response) => {
          this.exchangeData = response;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching exchange details:', error);
          this.loading = false;
        }
      });
    }

  }

  getExchangeItems(isExchange: number) {
    if (!this.exchangeData?.data?.exchange_details) return [];
    return this.exchangeData.data.exchange_details.filter(
      (item: ExchangeDetail) => item.is_exchange === isExchange
    );
  }
}
