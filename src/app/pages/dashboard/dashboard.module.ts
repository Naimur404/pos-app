import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DashboardPage } from './dashboard.page';
import { StatCardComponent } from './components/stat-card.component';
import { StatSummaryCardComponent } from './components/stat-summary-card.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardPage
      }
    ])
  ],
  declarations: [
    DashboardPage,
    StatCardComponent,
    StatSummaryCardComponent
  ]
})
export class DashboardPageModule {}
