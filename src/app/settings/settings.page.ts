import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  message = 'Now you can learn at any time.\n\nEnlighto is introducing to you audio classes. You can now learn in between any routine activities like traveling, working and pretty much anything for PSC exams and any other competitive exams for free absolutely. Listen and learn the classes\n\nDownload from play store\n\nhttps://play.google.com/store/apps/details?id=com.ilalife.enlighto\n\nFollow us on\n\nwww.facebook.com/enlightoonline\n\nhttps://instagram.com/enlightoonline'
  constructor(private socialSharing: SocialSharing) {}

  share() {
    this.socialSharing.share(this.message, 'Enlighto');
  }
}
