import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;
  private loadingStack: number = 0;

  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string = 'Saving invoice...') {
    this.loadingStack++;
    if (this.loadingStack === 1) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'circular',
        translucent: true,
        cssClass: 'custom-loading',
        mode: 'ios'
      });
      await this.loading.present();
    }
  }

  async hideLoading() {
    this.loadingStack--;
    if (this.loadingStack === 0 && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  async updateMessage(newMessage: string) {
    if (this.loading) {
      this.loading.message = newMessage;
    }
  }

  isLoading(): boolean {
    return this.loadingStack > 0;
  }
}


