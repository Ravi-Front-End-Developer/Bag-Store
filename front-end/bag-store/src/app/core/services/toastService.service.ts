import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(message: string, position: 'bottom' | 'top' | 'middle' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position,
      cssClass: 'custom-toast', // Your custom class name
    });

    await toast.present();
  }
}