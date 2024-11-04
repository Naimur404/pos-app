import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InvoiceDetailsPage } from './invoice-details.page';
import { InvoiceDetailsPageRoutingModule } from './invoice-details-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    InvoiceDetailsPageRoutingModule
  ],
  declarations: [InvoiceDetailsPage]
})
export class InvoiceDetailsPageModule {}
