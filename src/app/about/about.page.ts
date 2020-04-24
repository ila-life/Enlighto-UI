import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  versionNumber = '0.0.0';
  appName = 'Enlighto';
  constructor(private appVersion: AppVersion) { }

  async ngOnInit() {
    this.versionNumber = await this.appVersion.getVersionNumber();
    this.appName = await this.appVersion.getAppName();
  }
}
