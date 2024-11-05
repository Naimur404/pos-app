// pos.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PosPage } from './pos.page';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
import { NewCustomerModalComponent } from './components/new-customer-modal/new-customer-modal.component';
import { InvoiceComponent } from './components/invoice.component';
import { SharedModule } from '../../shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: PosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,

  ],
  declarations: [
    PosPage,
    ProductModalComponent,
    CustomerModalComponent,
    NewCustomerModalComponent,
    InvoiceComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PosPageModule {}
