import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceDetailsPage } from './invoice-details.page';

describe('InvoiceDetailsPage', () => {
  let component: InvoiceDetailsPage;
  let fixture: ComponentFixture<InvoiceDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
