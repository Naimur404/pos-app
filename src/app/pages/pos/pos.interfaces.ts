export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  points: number;
}

export interface Product {
  id: number;
  stock_id: number;
  name: string;
  category: string;
  size: string;
  stock: number;
  price: number;
  quantity?: number;
}

export interface Toast {
  message: string;
  isVisible: boolean;
  duration?: number;
  color?: string;
}
export interface User {
  name: any;
  id: any;
  email: string;
  outlet_id: any;
}

export interface CustomerResponse {
  customer: Customer;
  flag: boolean;
  message: string;
}
export interface PaymentMethod {
  id: number;
  name: boolean;
}
