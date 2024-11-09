import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeDetailsPage } from './exchange-details.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangeDetailsPageRoutingModule {}
