import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() user: any = {};
  @Input() showInvoiceButton: boolean = true;
  @Input() showPosButton: boolean = true;
  @Input() backButton: boolean = false;
  @Input() showInvoiceDetails: boolean = true;
  @Input() dashboardButton: boolean = true;
  @Input() title: any = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private menuController: MenuController
  ) {}

  async toggleMenu() {
    await this.menuController.toggle();
  }

  async goToInvoices() {
    try {
      await this.router.navigate(['/all-invoice']);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/dashboard';
    }
  }
  async goToIdashboard() {
    try {
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/dashboard';
    }
  }
  async goToPos() {
    try {
      await this.router.navigate(['/pos']);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/dashboard';
    }
  }
  async handleLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  printInvoice() {
    window.print();
  }
}
