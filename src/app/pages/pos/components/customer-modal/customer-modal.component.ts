import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from '../../pos.interfaces';
import { ModalController } from '@ionic/angular';
import { NewCustomerModalComponent } from '../new-customer-modal/new-customer-modal.component';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent {
  @Input() isOpen = false;
  @Input() customersList: Customer[] = [];
  @Input() searchCustomer = '';

  @Output() modalClose = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() customerSelected = new EventEmitter<Customer>();
  @Output() newCustomerSaved = new EventEmitter<Customer>();

  constructor(private modalController: ModalController) {}

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

  async openNewCustomerModal() {
    const modal = await this.modalController.create({
      component: NewCustomerModalComponent,
      cssClass: 'custom-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.newCustomerSaved.emit(result.data);
      }
    });

    await modal.present();
  }
}
