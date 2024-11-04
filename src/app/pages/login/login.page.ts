// login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async handleLogin() {
    if (!this.email || !this.password) {
      await this.presentToast('Please fill in all fields', 'warning');
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.authService.login(this.email, this.password).toPromise();

      if (response && response.status === 'success') {
        await this.presentToast('Login successful', 'success');
        setTimeout(() => {
          this.router.navigate(['/pos']);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      await this.presentToast(
        error.error?.message || 'Login failed. Please try again.',
        'danger'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
  async ngOnInit() {
    if (await this.authService.isAuthenticated()) {
      this.router.navigate(['/pos']);
    }
  }
}
