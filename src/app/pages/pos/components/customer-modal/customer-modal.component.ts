// customer-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from '../../pos.interfaces';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent {
  @Input() isOpen = false;
  @Input() customersList: Customer[] = [];
  @Input() searchCustomer = '';
  @Input() isNewCustomerModalOpen = false;  // Add this

  @Output() modalClose = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() customerSelected = new EventEmitter<Customer>();
  @Output() newCustomerClick = new EventEmitter<void>();
  @Output() newCustomerModalClose = new EventEmitter<void>();  // Add this
  @Output() newCustomerSaved = new EventEmitter<Customer>();   // Add this

  onSearchChange(event: any) {
    const value = event.target.value || '';
    this.searchChange.emit(value);
   
}

  closeModal() {
    this.modalClose.emit();
  }

  selectCustomer(customer: Customer) {
    this.customerSelected.emit(customer);
    this.closeModal();
  }

  openNewCustomerModal() {
    this.newCustomerClick.emit();
  }

  closeNewCustomerModal() {
    this.newCustomerModalClose.emit();
  }

  onNewCustomerSaved(customer: any) {
    this.newCustomerSaved.emit(customer);
  }
}
