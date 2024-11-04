import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InvoiceListPage } from './invoice-list.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: InvoiceListPage
      }
    ])
  ],
  declarations: [InvoiceListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoiceListPageModule {}
