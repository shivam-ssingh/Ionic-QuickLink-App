import { Injectable } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Injectable({
  providedIn: 'root',
})
export class SplashscreenService {
  constructor() {}

  async show(duration: number = 2000) {
    await SplashScreen.show({
      showDuration: duration,
      autoHide: true,
    });
  }

  async hide() {
    await SplashScreen.hide();
  }
}
