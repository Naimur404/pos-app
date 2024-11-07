import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DashboardData, TopSale } from './dashboard.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  dashboardData: DashboardData = {
    customers: 0,
    products: 0,
    stocks: 0,
    sales: 0,
    invoices: 0,
    last_day_sales: 0,
    this_month_sales: 0,
    this_month_invoices: 0
  };
  topSales: TopSale[] = [];


  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadTopSales();
  }

  private readonly MIN_LOADING_TIME = 1000; // 1 second minimum loading time

  async loadDashboardData() {
    const startTime = Date.now();
    this.isLoading = true;

    try {
      const data = await this.dashboardService.getDashboardData().toPromise();

      if (data) {
        this.dashboardData = data;

      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      // Ensure minimum loading time
      const elapsed = Date.now() - startTime;
      if (elapsed < this.MIN_LOADING_TIME) {
        await new Promise(resolve =>
          setTimeout(resolve, this.MIN_LOADING_TIME - elapsed)
        );
      }
      this.isLoading = false;
    }
  }



  // Helper method to format numbers
  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  loadTopSales() {
    // Subscribe to the Observable
    this.dashboardService.getTopSlaeData().subscribe({
      next: (data: TopSale[]) => {
        this.topSales = data;
      },
      error: (error) => {
        console.error('Error loading top sales:', error);
      }
    });
  }

}
