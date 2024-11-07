export interface DashboardData {
  customers: number;
  products: number;
  stocks: number;
  sales: number;
  invoices: number;
  last_day_sales: number;
  this_month_sales: number;
  this_month_invoices: number;
}

export interface TopSale {
  id: number;
  medicine_name: string;
  medicine_id: number;
  total: string;
  count: number;
}
