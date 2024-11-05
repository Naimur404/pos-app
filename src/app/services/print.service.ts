import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  printInvoice(htmlContent: string) {
    // Create a new window
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      console.error('Unable to open print window. Please check if pop-ups are blocked.');
      return;
    }

    // Set up the print window document
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            @media print {
              body { margin: 0; padding: 15px; }
              @page { margin: 0.5cm; }
              /* Add custom print styles */
              .print-only { display: block; }
              ion-header, ion-footer, .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 1000);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
