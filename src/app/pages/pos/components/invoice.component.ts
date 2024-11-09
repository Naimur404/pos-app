import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';

@Component({
  selector: 'app-invoice',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Receipt</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="printReceipt()">
            <ion-icon name="print-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="dismissModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="receipt-wrapper" #receiptContent>
        <!-- Rest of your existing template remains exactly the same -->
        <div class="printer-head">
        </div>

        <div class="receipt-container">
          <div class="receipt receipt-print-animation">
            <!-- Store Info -->
            <div class="store-info">
              <img [src]="logoUrl" class="logo" alt="Store Logo">
              <h2 class="store-name">{{ invoice.outlet?.outlet_name }}</h2>
              <p class="store-address">{{ invoice.outlet?.address }}</p>
              <p class="store-contact">Tel: {{ invoice.outlet?.mobile }}</p>
            </div>

            <!-- Order Info -->
            <div class="order-info">
              <div class="order-number">
                <span class="label">ORDER</span>
                <span class="value">#{{ invoice.id }}</span>
              </div>
              <div class="order-date">{{ invoice.sale_date | date:'MMM dd, yyyy' }}</div>
              <div class="order-time">{{ invoice.sale_date | date:'hh:mm a' }}</div>
            </div>

            <div class="separator"></div>

            <!-- Items -->
            <div class="items-section">
              <div class="items-header">
                <div class="item-col">Item</div>
                <div class="qty-col">Qty</div>
                <div class="price-col">Price</div>
                <div class="amount-col">Amount</div>
              </div>

              <div class="items-list">
                <div class="item-row" *ngFor="let item of invoice.invoice_details">
                  <div class="item-col">{{ item.medicine_name }}</div>
                  <div class="qty-col">{{ item.quantity }}</div>
                  <div class="price-col">{{ item.rate | number:'1.2-2' }}</div>
                  <div class="amount-col">{{ item.rate * item.quantity | number:'1.2-2' }}</div>
                </div>
              </div>
            </div>

            <div class="separator"></div>

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>{{ invoice.sub_total | number:'1.2-2' }}</span>
              </div>
              <div class="total-row discount" *ngIf="invoice.total_discount > 0">
                <span>Discount</span>
                <span>-{{ invoice.total_discount | number:'1.2-2' }}</span>
              </div>
              <div class="total-row vat" *ngIf="invoice.vat > 0">
                <span>VAT</span>
                <span>{{ invoice.vat | number:'1.2-2' }}</span>
              </div>
              <div class="total-row grand-total">
                <span>TOTAL</span>
                <span>{{ invoice.grand_total | number:'1.2-2' }}</span>
              </div>
              <div class="payment-info">
                <div class="total-row">
                  <span>Cash</span>
                  <span>{{ invoice.given_amount | number:'1.2-2' }}</span>
                </div>
                <div class="total-row">
                  <span>Change</span>
                  <span>{{ invoice.given_amount - invoice.payable_amount | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="customer-section" *ngIf="invoice.customer">
              <div class="customer-name">{{ invoice.customer?.name }}</div>
              <div class="points-info" *ngIf="invoice.customer?.name !== 'Walking Customer'">
                <div class="points-row">
                  <span>Points Earned</span>
                  <span>{{ invoice.earn_point }}</span>
                </div>
                <div class="points-row">
                  <span>Total Points</span>
                  <span>{{ invoice.customer?.points }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="receipt-footer">
              <div class="thank-you">Thank you for your purchase!</div>
              <div class="footer-text">Exchange possible within 4 days (T&C)</div>
              <div class="footer-text">Please bring invoice for exchange</div>
              <div class="powered-by">Powered by Tyrodevs.com</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .receipt-wrapper {
      background: #f5f5f5;
      min-height: 100%;
      padding: 20px 0;
      position: relative;
    }


.printer-line {
      height: 2px;
      width: 100%;
      background: #999;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }


    .receipt-container {
      max-width: 90mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 5px 5px;
    }

    .receipt {
      padding: 15px;
      font-family: 'Courier New', monospace;
    }

    .receipt-print-animation {
      animation: printReceipt 1.5s ease-out;
      transform-origin: top center;
    }

    @keyframes printReceipt {
      0% {
        transform: translateY(-100%);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .store-info {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      max-width: 120px;
      height: auto;
      margin: 0 auto 10px;
      display: block;
    }

    .store-name {
      font-size: 18px;
      font-weight: bold;
      margin: 5px 0;
    }

    .store-address, .store-contact {
      font-size: 12px;
      color: #666;
      margin: 3px 0;
    }

    .order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      font-size: 12px;
    }

    .order-number {
      .label {
        color: #666;
        margin-right: 5px;
      }
      .value {
        font-weight: bold;
      }
    }

    .separator {
      border-top: 1px dashed #ddd;
      margin: 10px 0;
    }

    .items-section {
      margin: 15px 0;
    }

    .items-header {
      display: grid;
      grid-template-columns: 40% 20% 20% 20%;
      font-size: 11px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 5px;
    }

    .item-row {
      display: grid;
      grid-template-columns: 40% 20% 20% 20%;
      font-size: 11px;
      padding: 3px 0;
    }

    .amount-col {
      text-align: right;
    }

    .totals-section {
      margin: 15px 0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin: 3px 0;
    }

    .grand-total {
      font-weight: bold;
      font-size: 14px;
      margin: 10px 0;
      border-top: 1px dashed #ddd;
      padding-top: 10px;
    }

    .payment-info {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #ddd;
    }

    .customer-section {
      text-align: center;
      margin: 15px 0;
      padding: 10px 0;
      border-top: 1px dashed #ddd;
    }

    .customer-name {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .points-info {
      font-size: 11px;
    }

    .receipt-footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px dashed #ddd;
    }

    .thank-you {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .footer-text {
      font-size: 10px;
      color: #666;
      margin: 3px 0;
    }

    .powered-by {
      font-size: 9px;
      color: #999;
      margin-top: 10px;
    }

    @media print {
      .receipt-container {
        box-shadow: none;
      }

      .printer-head {
        display: none;
      }

      ion-header {
        display: none;
      }
    }
  `]
})
export class InvoiceComponent {
  @Input() invoice: any;
  @Input() logoUrl: string = 'https://pos.stolen.com.bd/uploads/890117509.png';
  @ViewChild('receiptContent') receiptContent!: ElementRef; // Added ! operator here

  constructor(
    private modalController: ModalController,
    private printer: Printer,
    private platform: Platform
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  async printReceipt() {
    if (this.platform.is('cordova')) {
      // For mobile devices using Cordova
      const options: PrintOptions = {
        name: `Invoice-${this.invoice.id}`,
        duplex: false,
        orientation: 'portrait',
        monochrome: true
      };

      try {
        const content = this.receiptContent.nativeElement.innerHTML;
        await this.printer.print(content, options);
      } catch (error) {
        console.error('Printing failed:', error);
      }
    } else {
      // For web/PWA
      const printContent = this.receiptContent.nativeElement.innerHTML;
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Invoice</title>
              <style>
                .receipt-wrapper {
      background: #f5f5f5;
      min-height: 100%;
      padding: 20px 0;
      position: relative;
    }





    .receipt-container {
      max-width: 90mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 5px 5px;
    }

    .receipt {
      padding: 15px;
      font-family: 'Courier New', monospace;
    }


    .store-info {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      max-width: 120px;
      height: auto;
      margin: 0 auto 10px;
      display: block;
    }

    .store-name {
      font-size: 18px;
      font-weight: bold;
      margin: 5px 0;
    }

    .store-address, .store-contact {
      font-size: 12px;
      color: #666;
      margin: 3px 0;
    }

    .order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      font-size: 12px;
    }

    .order-number {
      .label {
        color: #666;
        margin-right: 5px;
      }
      .value {
        font-weight: bold;
      }
    }

    .separator {
      border-top: 1px dashed #ddd;
      margin: 10px 0;
    }

    .items-section {
      margin: 15px 0;
    }

    .items-header {
      display: grid;
      grid-template-columns: 40% 20% 20% 20%;
      font-size: 11px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 5px;
    }

    .item-row {
      display: grid;
      grid-template-columns: 40% 20% 20% 20%;
      font-size: 11px;
      padding: 3px 0;
    }

    .amount-col {
      text-align: right;
    }

    .totals-section {
      margin: 15px 0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin: 3px 0;
    }

    .grand-total {
      font-weight: bold;
      font-size: 14px;
      margin: 10px 0;
      border-top: 1px dashed #ddd;
      padding-top: 10px;
    }

    .payment-info {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #ddd;
    }

    .customer-section {
      text-align: center;
      margin: 15px 0;
      padding: 10px 0;
      border-top: 1px dashed #ddd;
    }

    .customer-name {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .points-info {
      font-size: 11px;
    }

    .receipt-footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px dashed #ddd;
    }

    .thank-you {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .footer-text {
      font-size: 10px;
      color: #666;
      margin: 3px 0;
    }

    .powered-by {
      font-size: 9px;
      color: #999;
      margin-top: 10px;
    }

    @media print {
      .receipt-container {
        box-shadow: none;
      }

      .printer-head {
        display: none;
      }

      ion-header {
        display: none;
      }
    }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  }
}
