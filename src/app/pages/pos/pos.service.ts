import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, Product, CustomerResponse, PaymentMethod } from '../pos/pos.interfaces';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../core/services/api.service';

interface InvoiceProduct {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  stock: any;
}

interface InvoicePayload {
  customer_id?: number;
  products: InvoiceProduct[];
  sub_total: number;
  discount_percentage: number;
  flat_discount: number;
  total_discount: number;
  payable_amount: number;
  payment_type: number;
  given_amount: number;
  change_amount: number;
  redeemed_points?: number;
  outlet_id: number;
}

export interface Invoice {
  products: Product[];
  customer: Customer | null;
  subTotal: number;
  discountPercentage: number;
  flatDiscount: number;
  totalDiscount: number;
  payableAmount: number;
  paymentType: number;
  givenAmount: number;
  changeAmount: number;
  redeemedPoints?: number;
  outlet_id: number;
}



@Injectable({
  providedIn: 'root'
})
export class PosService {
  // private readonly API_URL = 'http://192.168.68.54:8000/api';
  private selectedProductsSubject = new BehaviorSubject<Product[]>([]);
  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);

  constructor(private http: HttpClient,
    private apiService: ApiService
  ) {}

  // Customer Methods
  getAllCustomers(): Observable<Customer[]> {
    return this.apiService.get<any[]>(`customer`).pipe(
      map(response => response.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.mobile,
        address: customer.address,
        points: customer.points || 0
      })))
    );
  }

  getAllPaymentMethod(): Observable<PaymentMethod[]> {
    return this.apiService.get<any[]>(`payment-method`).pipe(
      map(response => response.map(PaymentMethod => ({
        id: PaymentMethod.id,
        name: PaymentMethod.name,

      })))
    );
  }

  searchCustomers(searchTerm: string): Observable<Customer[]> {
    return this.apiService.get<any[]>(`customer`, {
      params: { search: searchTerm }
    }).pipe(
      map(response => response.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.mobile,
        address: customer.address,
        points: customer.points || 0
      })))
    );
  }

  // Product Methods
  getAllProducts(): Observable<Product[]> {
    return this.apiService.get<any[]>(`product`).pipe(
      map(response => response.map(product => ({
        id: product.product_id,
        stock_id: product.stock_id,
        name: product.name,
        category: product.category_name,
        size: product.size,
        stock: product.quantity,
        price: product.price
      })))
    );
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.apiService.get<any[]>(`product`, {
      params: { search: searchTerm }
    }).pipe(
      map(response => response.map(product => ({
        id: product.product_id,
        stock_id: product.stock_id,
        name: product.name,
        category: product.category_name,
        size: product.size,
        stock: product.quantity,
        price: product.price
      })))
    );
  }

  // Selected Products Management
  getSelectedProducts(): Observable<Product[]> {
    return this.selectedProductsSubject.asObservable();
  }

  addProduct(product: Product) {
    const currentProducts = this.selectedProductsSubject.value;
    const existingProduct = currentProducts.find(p => p.stock_id === product.stock_id);

    if (existingProduct) {
      if (existingProduct.quantity! < product.stock) {
        existingProduct.quantity!++;
        this.selectedProductsSubject.next([...currentProducts]);
      }
    } else {
      this.selectedProductsSubject.next([...currentProducts, { ...product, quantity: 1 }]);
    }
  }

  removeProduct(index: number) {
    const currentProducts = this.selectedProductsSubject.value;
    currentProducts.splice(index, 1);
    this.selectedProductsSubject.next([...currentProducts]);
  }

  // Selected Customer Management
  getSelectedCustomer(): Observable<Customer | null> {
    return this.selectedCustomerSubject.asObservable();
  }

  setSelectedCustomer(customer: Customer | null) {
    this.selectedCustomerSubject.next(customer);
  }

  // Save Invoice
  saveInvoice(invoice: Invoice): Observable<any> {
    // Transform the invoice data to match the API expected format
    const payload: InvoicePayload = {
      customer_id: invoice.customer?.id,
      products: invoice.products.map(product => ({
        product_id: product.id,
        stock: product.quantity,
        name: product.name,
        quantity: product.quantity || 1,
        price: product.price,
        stock_id: product.stock_id,
        size: product.size,
        discount: 0
      })),
      outlet_id: invoice.outlet_id,
      sub_total: invoice.subTotal,
      discount_percentage: invoice.discountPercentage,
      flat_discount: invoice.flatDiscount,
      total_discount: invoice.totalDiscount,
      payable_amount: invoice.payableAmount,
      payment_type: invoice.paymentType,
      given_amount: invoice.givenAmount,
      change_amount: invoice.changeAmount,
      redeemed_points: invoice.redeemedPoints
    };

    return this.apiService.post(`invoice-create`, payload);
  }

  saveCustomer(customerData: Customer): Observable<CustomerResponse> {
    return this.apiService.post<CustomerResponse>(`customer`, customerData);
}
}
