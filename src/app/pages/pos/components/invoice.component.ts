import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-invoice',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Invoice</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismissModal()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div class="receipt">
      <div class="header">
        <img [src]="logoUrl" class="pos-logo" alt="Logo">
        <p>
          <b class="outlet-name">{{ invoice.outlet?.outlet_name }}</b><br>
          {{ invoice.outlet?.address }}<br>
          {{ invoice.outlet?.mobile }}
        </p>
      </div>

      <div class="order-details">
        <table class="product-table">
          <tr class="new">
            <td class="text-left">Order ID: #{{ invoice.id }}</td>
            <td class="text-right">Date: {{ invoice.sale_date | date:'dd-MM-yyyy' }}</td>
          </tr>
          <tr class="new">
            <td class="text-left">Posted By: {{ invoice.added_by }}</td>
            <td class="text-right">Pay Mode: {{ invoice.payment_method_id }}</td>
          </tr>
        </table>
      </div>

      <hr>

      <table class="product-table">
        <thead>
          <tr>
            <th class="product">Item</th>
            <th>Size</th>
            <th>Rate</th>
            <th>Qty</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of invoice.invoice_details; let i = index">
            <td class="product">
              {{ i + 1 }}. {{ item.medicine_name }}
              <span *ngIf="item.remarks">({{ item.remarks }})</span>
            </td>
            <td>{{ item.size }}</td>
            <td>{{ item.rate }}</td>
            <td>{{ item.quantity }}</td>
            <td class="text-right">{{ item.rate * item.quantity | number:'1.0-0' }}</td>
          </tr>
        </tbody>
      </table>

      <table class="payment-table">
        <tr>
          <td colspan="3" class="text-right">Sub Total:</td>
          <td class="amount">{{ invoice.sub_total | number:'1.0-0' }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Discount:</td>
          <td class="amount">{{ invoice.total_discount | number:'1.0-0' }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Vat:</td>
          <td class="amount">{{ invoice.vat | number:'1.0-0' }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-right"><b>Grand Total:</b></td>
          <td class="amount"><b>{{ invoice.grand_total | number:'1.0-0' }}</b></td>
        </tr>
        <tr>
          <td colspan="3" class="text-right"><b>Payable Amount:</b></td>
          <td class="amount"><b>{{ invoice.payable_amount | number:'1.0-0' }}</b></td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Given Amount:</td>
          <td class="amount">{{ invoice.given_amount | number:'1.0-0' }}</td>
        </tr>
        <tr *ngIf="invoice.given_amount > invoice.payable_amount">
          <td colspan="3" class="text-right">Change Amount:</td>
          <td class="amount">{{ invoice.given_amount - invoice.payable_amount | number:'1.0-0' }}</td>
        </tr>
      </table>

      <hr>

      <table class="payment-table">
        <tr>
          <td class="text-left">Name:</td>
          <td colspan="3"><b>{{ invoice.customer?.name }}</b></td>
        </tr>
        <tr *ngIf="invoice.customer?.name !== 'Walking Customer'">
          <td class="text-left">Earned Points:</td>
          <td colspan="3"><b>{{ invoice.earn_point }}</b></td>
        </tr>
        <tr *ngIf="invoice.redeem_point > 0">
          <td class="text-left">Redeem Points:</td>
          <td colspan="3"><b>{{ invoice.redeem_point }}</b></td>
        </tr>
        <tr *ngIf="invoice.customer?.name !== 'Walking Customer'">
          <td class="text-left">Total Points:</td>
          <td colspan="3"><b>{{ invoice.customer?.points }}</b></td>
        </tr>
      </table>


      <div class="footer">
        <h4>A Concern of Stolen Group</h4>
        <h4>Thank You ❤</h4>
        <h5>Developed By: Tyrodevs.com</h5>
        <h5>চার দিনের মধ্যে এক্সচেঞ্জ সম্ভব (T&C)</h5>
        <h5>ইনভয়েস অবশ্যই সাথে নিয়ে আসতে হবে</h5>
      </div>
    </div>
  `,
  styles: [`
    .receipt {
      width: 4in;
      margin: 50px auto;
      border: 2px solid lightgray;
      padding: 10px;
    }

    .header {
      text-align: center;
      margin: 10px 0;
    }

    .pos-logo {
      max-height: 100px;
      max-width: 300px;
      filter: grayscale(100%);
    }

    .outlet-name {
      font-size: 20px;
    }

    .product-table {
      width: 100%;
      border-collapse: collapse;
    }

    .product-table th,
    .product-table td {
      text-align: center;
    }

    .product {
      text-align: left;
    }

    tr {
      border-bottom: 1pt solid black;
    }

    .new {
      border-bottom: none;
    }

    .text-left {
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    .amount {
      width: 50px;
      border: none;
      text-align: right;
    }

    .payment-table {
      width: 100%;
    }

    .barcode-container {
      text-align: center;
      margin: 20px 0;
    }

    .footer {
      text-align: center;
      margin: 10px 0;
    }

    h2, h4, h5 {
      margin: 0;
    }

    hr {
      margin: 15px 0;
  }`]
})

export class InvoiceComponent {
  @Input() invoice: any;
  @Input() logoUrl: string = 'https://pos.stolen.com.bd/uploads/890117509.png';


  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
