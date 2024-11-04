import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { InvoiceListService } from './invoice-list.service';
import { Invoice, User } from './invoice-list.interfaces';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.page.html',
  styleUrls: ['./invoice-list.page.scss']
})
export class InvoiceListPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  invoices: Invoice[] = [];
  isLoading = false;
  searchQuery = '';
  selectedPaymentMethod = '';
  paymentMethods = ['Cash', 'Card', 'Mobile Banking'];
  currentPage = 1;
  hasMoreData = true;
  totalRecords = 0;
  perPage = 10;
  isFirstLoad = true;
  user: User | any = [];

  constructor(
    private router: Router,
    private invoiceListService: InvoiceListService
  ) {
    this.setupSearch();
  }

  ngOnInit() {
    this.fetchInvoices(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.fetchInvoices(true);
    });
  }

  async goToInvoice() {
    try {
      await this.router.navigate(['/invoice']);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/invoice';
    }
  }

  resetState() {
    this.invoices = [];
    this.currentPage = 1;
    this.hasMoreData = true;
    this.searchQuery = '';
    this.selectedPaymentMethod = '';
    this.isLoading = false;
    this.totalRecords = 0;
    this.isFirstLoad = true;
  }



  async fetchInvoices(isRefresh: boolean = false): Promise<void> {
    try {
      if (this.isFirstLoad || isRefresh) {
        this.isLoading = true;
      }

      const response = await this.invoiceListService.getInvoices(
        isRefresh ? 1 : this.currentPage,
        this.perPage,
        this.searchQuery,
        this.selectedPaymentMethod
      ).toPromise();

      // Handle potential undefined response
      if (!response) {
        this.invoices = [];
        this.totalRecords = 0;
        this.hasMoreData = false;
        return;
      }

      if (response.status === 'success') {
        const newInvoices = response.data || [];
        this.totalRecords = response.total_records;

        if (isRefresh) {
          this.invoices = newInvoices;
        } else {
          this.invoices = [...this.invoices, ...newInvoices];
        }

        this.hasMoreData = this.invoices.length < this.totalRecords;
        this.isFirstLoad = false;
      } else {
        // Handle unsuccessful response
        this.invoices = isRefresh ? [] : this.invoices;
        console.error('Failed to fetch invoices:', response.status);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      this.invoices = isRefresh ? [] : this.invoices;
    } finally {
      this.isLoading = false;
    }
  }

  handleSearch(event: any) {
    this.searchQuery = event.detail.value;
    this.searchSubject.next(this.searchQuery);
  }

  filterByPaymentMethod(method: string) {
    this.selectedPaymentMethod = this.selectedPaymentMethod === method ? '' : method;
    this.currentPage = 1;
    this.hasMoreData = true;
    this.fetchInvoices(true);
  }

  async loadMore(event: InfiniteScrollCustomEvent) {
    if (!this.hasMoreData) {
      event.target.complete();
      event.target.disabled = true;
      return;
    }

    this.currentPage += 1;
    await this.fetchInvoices();
    event.target.complete();
  }

  getPaymentMethodColor(method: string): string {
    switch (method) {
      case 'Cash':
        return 'success';
      case 'Card':
        return 'primary';
      default:
        return 'tertiary';
    }
  }

  viewInvoiceDetails(invoiceId: number) {
    this.router.navigate(['/invoice-details', invoiceId]);
  }
}
