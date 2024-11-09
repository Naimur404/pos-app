import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangeDetailsPageRoutingModule } from './exchange-details-routing.module';

import { ExchangeDetailsPage } from './exchange-details.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangeDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [ExchangeDetailsPage]
})
export class ExchangeDetailsPageModule {}
