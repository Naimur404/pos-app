import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <ion-card class="dashboard-card">
      <ion-card-content>
        <div class="card-icon-container {{ colorClass }}">
          <ion-icon [name]="icon" size="large"></ion-icon>
        </div>
        <div class="card-content">
          <h3>{{ title }}</h3>
          <p class="stat">{{ prefix }}{{ formattedValue }}</p>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '';
  @Input() colorClass: string = 'primary';
  @Input() prefix: string = '';

  get formattedValue(): string {
    return this.value.toLocaleString();
  }
}
