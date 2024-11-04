import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../pos.interfaces';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent {
  @Input() isOpen = false;
  @Input() productsList: Product[] = [];
  @Input() searchProduct = '';

  @Output() modalClose = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() productSelected = new EventEmitter<Product>();


  onSearchChange(event: any) {
    const value = event.target.value || '';
    this.searchChange.emit(value);
  
}

  closeModal() {
    this.modalClose.emit();
  }

  selectProduct(product: Product) {
    this.productSelected.emit(product);
  }


}
