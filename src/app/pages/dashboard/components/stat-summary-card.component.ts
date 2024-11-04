import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-summary-card',
  template: `
    <ion-card class="stat-card">
      <ion-card-header>
        <ion-card-title>{{ title }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="stat-item" *ngFor="let stat of stats">
          <ion-label>
            <h3>{{ stat.title }}</h3>
            <p>{{ stat.prefix }}{{ formatNumber(stat.value) }}</p>
          </ion-label>
          <ion-icon [name]="stat.icon" [color]="stat.color"></ion-icon>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./stat-summary-card.component.scss']
})
export class StatSummaryCardComponent {
  @Input() title: string = '';
  @Input() stats: Array<{
    title: string;
    value: number;
    icon: string;
    color: string;
    prefix?: string;
  }> = [];

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}

