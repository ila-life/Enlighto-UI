import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appMinimize: AppMinimize,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.backButton.subscribe(async () => {
        if (this.isHome()) {
          // if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          // navigator['app'].exitApp(); // tslint:disable-line
          this.appMinimize.minimize();
          // } else {
          //   const toast = await this.toastCtrl.create({
          //     message: 'Press back again to exit App',
          //     duration: 3000,
          //     position: 'bottom'
          //   });
          //   toast.present();
          //   this.lastTimeBackPress = new Date().getTime();
          // }
        }
      });
    });
  }

  isHome() {
    return this.router.url.endsWith('/tabs/home') || this.router.url.endsWith('/tabs/settings');
  }
}
