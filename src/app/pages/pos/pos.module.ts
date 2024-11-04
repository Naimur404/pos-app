import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PosPage } from './pos.page';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
// import { NewCustomerModalComponent } from './components/new-customer-modal/new-customer-modal.component';
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
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,

  ],
  declarations: [
    PosPage,
    ProductModalComponent,
    CustomerModalComponent,
    // NewCustomerModalComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PosPageModule {}