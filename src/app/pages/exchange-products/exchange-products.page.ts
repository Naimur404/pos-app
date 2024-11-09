// exchange-products.page.ts
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ExchangeService } from '../../services/exchange.service';
interface Product {
  id: number;
  stock_id: number;
  name: string;
  category: string;
  size: string;
  stock: number;
  price: number;
  quantity?: number;
}
@Component({
  selector: 'app-exchange-products',
  templateUrl: './exchange-products.page.html',
  styleUrls: ['./exchange-products.page.scss'],
})
export class ExchangeProductsPage implements OnInit {
  isLoading = false;
  invoiceId: string = '';

  // Product Modal
  isProductModalOpen = false;
  productsList: Product[] = [];
  searchProduct: string = '';

  exchangeProducts: any[] = [];
  selectedExchangeProducts: any[] = [];
  selectedNewProducts: any[] = [];
  exchangeGrandTotal = 0;
  newProductsGrandTotal = 0;

  constructor(
    private exchangeService: ExchangeService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async fetchExchangeProducts() {
    if (!this.invoiceId) {
      this.showToast('Please enter invoice ID', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Fetching products...'
    });
    await loading.present();

    try {
      const response = await this.exchangeService.getExchangeProducts(this.invoiceId).toPromise();
      if (response.status === 'success') {
        this.exchangeProducts = response.data;
      } else {
        this.showToast(response.message, 'danger');
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to fetch products', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  // Product Modal Methods
  openProductModal() {
    // console.log('helli');
     this.isProductModalOpen = true;
    this.searchProduct = '';
  }

  async onSearchProductChange(term: string) {
    try {
      const response = await this.exchangeService.searchProducts(term).toPromise();
      this.productsList = response || [];
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to search products', 'danger');
    }
  }

  addProduct(product: any) {
    const existingProduct = this.selectedNewProducts.find(p => p.id === product.stock_id);
    if (existingProduct) {
      this.showToast('Product already added', 'warning');
      return;
    }

    this.selectedNewProducts.push({
      id: product.stock_id,
      name: product.name,
      size: product.size,
      avalqty: product.quantity,
      qty: 1,
      price: product.price,
      total_price: product.price
    });

    this.calculateNewProductsTotal();
    this.isProductModalOpen = false;
  }

  toggleExchangeProduct(product: any) {
    const index = this.selectedExchangeProducts.findIndex(p => p.id === product.medicine_id);
    if (index === -1) {
      this.selectedExchangeProducts.push({
        id: product.medicine_id,
        name: product.medicine_name,
        size: product.size,
        avalqty: product.available_qty,
        qty: product.quantity,
        price: product.rate,
        total_price: product.total_price,
        purchase: 1
      });
    } else {
      this.selectedExchangeProducts.splice(index, 1);
    }
    this.calculateExchangeTotal();
  }

  removeProduct(index: number) {
    this.selectedNewProducts.splice(index, 1);
    this.calculateNewProductsTotal();
  }

  updateQuantity(product: any, isIncrease: boolean) {
    if (isIncrease) {
      if (product.qty < product.avalqty) {
        product.qty++;
      } else {
        this.showToast('Maximum available quantity reached', 'warning');
        return;
      }
    } else {
      if (product.qty > 1) {
        product.qty--;
      } else {
        return;
      }
    }
    product.total_price = product.price * product.qty;
    this.calculateNewProductsTotal();
  }

  calculateExchangeTotal() {
    this.exchangeGrandTotal = this.selectedExchangeProducts.reduce(
      (total, product) => total + product.total_price, 0
    );
  }

  calculateNewProductsTotal() {
    this.newProductsGrandTotal = this.selectedNewProducts.reduce(
      (total, product) => total + product.total_price, 0
    );
  }

  async submitExchange() {
    if (this.selectedExchangeProducts.length === 0) {
      this.showToast('Please select products to exchange', 'warning');
      return;
    }

    if (this.selectedNewProducts.length === 0) {
      this.showToast('Please select new products', 'warning');
      return;
    }

    if (this.newProductsGrandTotal < this.exchangeGrandTotal) {
      this.showToast('New products total cannot be less than exchange products total', 'warning');
      return;
    }

    const payload = {
      invoice_id: this.invoiceId,
      exchange_products: [
        ...this.selectedExchangeProducts,
        { grandTotal: this.exchangeGrandTotal }
      ],
      new_products: [
        ...this.selectedNewProducts,
        { grandTotal: this.newProductsGrandTotal }
      ]
    };

    const loading = await this.loadingController.create({
      message: 'Processing exchange...'
    });
    await loading.present();

    try {
      const response = await this.exchangeService.submitExchange(payload).toPromise();
      if (response.status === 'success') {
        this.showToast('Exchange completed successfully', 'success');
        this.resetForm();
      } else {
        this.showToast(response.message, 'danger');
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to process exchange', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  resetForm() {
    this.invoiceId = '';
    this.exchangeProducts = [];
    this.selectedExchangeProducts = [];
    this.selectedNewProducts = [];
    this.exchangeGrandTotal = 0;
    this.newProductsGrandTotal = 0;
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }


}
