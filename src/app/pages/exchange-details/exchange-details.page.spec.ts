import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeDetailsPage } from './exchange-details.page';

describe('ExchangeDetailsPage', () => {
  let component: ExchangeDetailsPage;
  let fixture: ComponentFixture<ExchangeDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
