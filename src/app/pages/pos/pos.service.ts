import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, Product } from '../pos/pos.interfaces';

interface InvoiceProduct {
  product_id: number;
  quantity: number;
  price: number;
}

interface InvoicePayload {
  customer_id?: number;
  products: InvoiceProduct[];
  sub_total: number;
  discount_percentage: number;
  flat_discount: number;
  total_discount: number;
  payable_amount: number;
  payment_type: string;
  given_amount: number;
  change_amount: number;
  redeemed_points?: number;
}

export interface Invoice {
  products: Product[];
  customer: Customer | null;
  subTotal: number;
  discountPercentage: number;
  flatDiscount: number;
  totalDiscount: number;
  payableAmount: number;
  paymentType: string;
  givenAmount: number;
  changeAmount: number;
  redeemedPoints?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PosService {
  private readonly API_URL = 'http://192.168.68.54:8000/api';
  private selectedProductsSubject = new BehaviorSubject<Product[]>([]);
  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);

  constructor(private http: HttpClient) {}

  // Customer Methods
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<any[]>(`${this.API_URL}/customer`).pipe(
      map(response => response.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.mobile,
        address: customer.address,
        points: customer.points || 0
      })))
    );
  }

  searchCustomers(searchTerm: string): Observable<Customer[]> {
    return this.http.get<any[]>(`${this.API_URL}/customer`, {
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
    return this.http.get<any[]>(`${this.API_URL}/product`).pipe(
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
    return this.http.get<any[]>(`${this.API_URL}/product`, {
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
        quantity: product.quantity || 1,
        price: product.price
      })),
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

    return this.http.post(`${this.API_URL}/invoice`, payload);
  }

  saveCustomer(customerData: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.API_URL}/customers`, customerData);
  }
}
