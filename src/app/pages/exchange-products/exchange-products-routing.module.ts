import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeProductsPage } from './exchange-products.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangeProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangeProductsPageRoutingModule {}
