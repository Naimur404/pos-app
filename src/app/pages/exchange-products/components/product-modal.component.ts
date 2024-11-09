// product-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-modal',
  template: `
    <ion-modal [isOpen]="isOpen" (didDismiss)="modalClose.emit()">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Select Product</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="modalClose.emit()">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-toolbar>
            <ion-searchbar
              [(ngModel)]="searchProduct"
              (ionInput)="onSearchChange($event)"
              placeholder="Search products">
            </ion-searchbar>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-item *ngFor="let product of productsList" button (click)="selectProduct(product)">
              <ion-label>
                <h2>{{product.name}} ({{product.size}})</h2>
                <p>Stock: {{product.quantity}} | Price: ৳{{product.price}}</p>
              </ion-label>
              <ion-note slot="end" color="primary">৳{{product.price}}</ion-note>
            </ion-item>
          </ion-list>

          <div class="ion-text-center ion-padding" *ngIf="productsList.length === 0">
            <p>No products found</p>
          </div>
        </ion-content>
      </ng-template>
    </ion-modal>
  `
})
export class ProductModalComponent {
  @Input() isOpen = false;
  @Input() productsList: any[] = [];
  @Input() searchProduct = '';

  @Output() modalClose = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() productSelected = new EventEmitter<any>();

  onSearchChange(event: any) {
    this.searchChange.emit(event.target.value);
  }

  selectProduct(product: any) {
    this.productSelected.emit(product);
  }
}
