export interface Invoice {
  id: number;
  outlet_name: string;
  sale_date: string;
  mobile: string;
  paid_amount: number;
  payment_method_id: string;
}

export interface InvoiceResponse {
  status: string;
  data: Invoice[];
  total_records: number;
}

export interface User {
  name: any;
  id: any;
  email: string;
  outlet_id: any;
}
