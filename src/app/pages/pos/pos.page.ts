import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PosService , Invoice} from './pos.service';
import { AuthService } from '../../services/auth.service';
import { Customer, Product, User } from './pos.interfaces';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss']
})
export class PosPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchProduct$ = new Subject<string>();
  private searchCustomer$ = new Subject<string>();

  // UI states
  isCustomerModalOpen = false;
  isProductModalOpen = false;
  isNewCustomerModalOpen = false;
  searchCustomer = '';
  searchProduct = '';

  // Data lists
  productsList: Product[] = [];
  customersList: Customer[] = [];
  selectedProducts: Product[] = [];
  selectedCustomer: Customer | null = null;
  user: User | any = [];


  // Form inputs
  flatDiscount = 0;
  discountPercentage = 0;
  redeemedPoints = 0;
  paymentType = 'Cash';
  givenAmount = 0;

  // New Customer Form
  newCustomerName = '';
  newCustomerPhone = '';
  newCustomerAddress = '';

  constructor(
    private router: Router,
    private posService: PosService,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {}


  ngOnInit() {

    this.authService.getUser().subscribe((user: User | any) => {
      console.log('Raw User Data:', user);

      if (user && user.name) {

        this.user = user;
      } else {
        console.log('User data is undefined or malformed');
      }
    });

    this.setupSearchSubscriptions();
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscriptions() {
    // Product search subscription
    this.searchProduct$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        if (term === '') {
          // When input is cleared, load initial product data
          this.loadAllProducts();
        } else {
          // Search products when term length is valid
          this.searchProducts(term);
        }
      });

    // Customer search subscription
    this.searchCustomer$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        if (term === '') {
          // When input is cleared, load initial customer data
          this.loadAllCustomers();
        } else {
          // Search customers when term length is valid
          this.searchCustomers(term);
        }
      });
  }

  private async loadInitialData() {
    await Promise.all([
      this.loadAllProducts(),
      this.loadAllCustomers()
    ]);
  }

  // Navigation Methods
  async goToInvoices() {
    try {
      await this.router.navigate(['/all']);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/all';
    }
  }

  async handleLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Customer Methods
  async loadAllCustomers() {
    try {
      const customers = await this.posService.getAllCustomers()
        .toPromise()
        .then(result => result || []);
      this.customersList = customers;
    } catch (error) {
      console.error('Error loading customers:', error);
      this.customersList = [];
    }
  }

  async searchCustomers(term: string) {
    try {
      const customers = await this.posService.searchCustomers(term)
        .toPromise()
        .then(result => result || []);
      this.customersList = customers;
    } catch (error) {
      console.error('Error searching customers:', error);
      this.customersList = [];
    }
  }

  // Product Methods
  async loadAllProducts() {
    try {
      const products = await this.posService.getAllProducts()
        .toPromise()
        .then(result => result || []);
      this.productsList = products;
    } catch (error) {
      console.error('Error loading products:', error);
      this.productsList = [];
    }
  }

  async searchProducts(term: string) {
    try {
      const products = await this.posService.searchProducts(term)
        .toPromise()
        .then(result => result || []);
      this.productsList = products;
    } catch (error) {
      console.error('Error searching products:', error);
      this.productsList = [];
    }
  }

  // Modal Actions
  openCustomerModal() {
    this.isCustomerModalOpen = true;
    this.loadAllCustomers();
  }

  openProductModal() {
    this.isProductModalOpen = true;
    this.loadAllProducts();
  }

  openNewCustomerModal() {
    this.isNewCustomerModalOpen = true;
  }

  // Product Actions
  addProduct(product: Product) {
    const existingProduct = this.selectedProducts.find(p => p.stock_id === product.stock_id);

    if (existingProduct) {
      if (existingProduct.quantity! < product.stock) {
        existingProduct.quantity!++;
      }
    } else {
      this.selectedProducts.push({
        ...product,
        quantity: 1
      });
    }

    this.isProductModalOpen = false;
  }

  async removeProduct(index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Remove Product',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.selectedProducts.splice(index, 1);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  updateQuantity(product: Product, increment: boolean) {
    if (increment && product.quantity! < product.stock) {
      product.quantity!++;
    } else if (!increment && product.quantity! > 1) {
      product.quantity!--;
    }
  }

  // Customer Actions
  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.isCustomerModalOpen = false;
  }

  clearCustomer() {
    this.selectedCustomer = null;
    this.redeemedPoints = 0;
  }

  redeemPoints() {
    if (this.selectedCustomer && this.redeemedPoints <= this.selectedCustomer.points) {
      this.flatDiscount += this.redeemedPoints;
      this.selectedCustomer.points -= this.redeemedPoints;
      this.redeemedPoints = 0;
    }
  }

  // UI Event Handlers
  // onSearchProductChange(event: any) {
  //   this.searchProduct$.next(event.detail.value);
  // }
  onSearchProductChange(searchText: string) {
    // Always emit empty string to trigger initial data load when input is cleared
    if (searchText.length === 0) {
      this.searchProduct$.next(searchText);
      return;
    }

    // Only trigger search when text length is 4 or more
    if (searchText.length >= 4) {
      this.searchProduct$.next(searchText);
    }
  }
  onSearchCustomerChange(searchText: string) {
     // Always emit empty string to trigger initial data load when input is cleared
     if (searchText.length === 0) {
      this.searchCustomer$.next(searchText);
      return;
    }

    // Only trigger search when text length is 4 or more
    if (searchText.length >= 4) {
      this.searchCustomer$.next(searchText);
    }

}
  // Calculations
  get subTotal(): number {
    return this.selectedProducts.reduce((total, item) =>
      total + (item.price * (item.quantity || 1)), 0);
  }

  get totalDiscount(): number {
    const percentageDiscount = this.subTotal * (this.discountPercentage / 100);
    return percentageDiscount + this.flatDiscount;
  }

  get payableAmount(): number {
    return Math.max(0, this.subTotal - this.totalDiscount);
  }

  get changeToReturn(): number {
    return Math.max(0, this.givenAmount - this.payableAmount);
  }

  // Form Submission
  async validateAndSubmit() {
    if (this.payableAmount <= 0) {
      await this.presentToast("Payable amount can't be zero. Please check the quantity and discount.", 'warning');
      return;
    }

    if (this.givenAmount < this.payableAmount) {
      await this.presentToast("Given amount is insufficient to complete the payment.", 'warning');
      return;
    }

    try {
      await this.saveInvoice();
      await this.presentToast("Sale completed successfully!", 'success');
      this.resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
      await this.presentToast("Error saving the sale. Please try again.", 'danger');
    }
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  private async saveInvoice() {
    const invoice: Invoice = {
      products: this.selectedProducts,
      customer: this.selectedCustomer,
      subTotal: this.subTotal,
      discountPercentage: this.discountPercentage,  // Added
      flatDiscount: this.flatDiscount,              // Added
      totalDiscount: this.totalDiscount,
      payableAmount: this.payableAmount,
      paymentType: this.paymentType,
      givenAmount: this.givenAmount,
      changeAmount: this.changeToReturn,
      redeemedPoints: this.redeemedPoints           // Added
    };

    try {
      await this.posService.saveInvoice(invoice).toPromise();
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  }

  private resetForm() {
    this.selectedProducts = [];
    this.selectedCustomer = null;
    this.flatDiscount = 0;
    this.discountPercentage = 0;
    this.redeemedPoints = 0;
    this.paymentType = 'Cash';
    this.givenAmount = 0;
  }
}
