// new-customer-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-customer-modal',
  templateUrl: './new-customer-modal.component.html',
  styleUrls: ['./new-customer-modal.component.scss']
})
export class NewCustomerModalComponent implements OnInit {
  customerForm: FormGroup;
  isOpen = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      address: ['']
    });
  }

  ngOnInit() {}

  async closeModal() {
    await this.modalController.dismiss();
  }

  async onSubmit() {
    if (this.customerForm.valid) {
      this.isSubmitting = true;
      try {
        // Add your submission logic here
        const customerData = this.customerForm.value;
        await this.modalController.dismiss(customerData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
