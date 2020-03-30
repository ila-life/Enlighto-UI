import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavController, NavParams, Navbar, Content, LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CloudProvider } from '../../providers/cloud/cloud';
import { pluck, filter, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('showHide', [
      state(
        'active',
        style({
          opacity: 1
        })
      ),
      state(
        'inactive',
        style({
          opacity: 0
        })
      ),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('250ms ease-out'))
    ])
  ]
})
export class HomePage {
  files: any = [];
  seekbar: FormControl = new FormControl("seekbar");
  state: any = {};
  onSeekState: boolean;
  currentFile: any = {};
  displayFooter: string = "inactive";
  loggedIn: Boolean;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public cloudProvider: CloudProvider,
    private store: Store<any>
  ) {
    this.getDocuments();
  }

  getDocuments() {
    let loader = this.presentLoading();
    this.cloudProvider.getFiles().subscribe(files => {
      this.files = files;
      loader.dismiss();
    });
  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Content. Please Wait...'
    });
    loading.present();
    return loading;
  }

  ionViewWillLoad() {
    this.store.select('appState').subscribe((value: any) => {
      this.state = { ...this.state, ...value.media };
    });

    // Resize the Content Screen so that Ionic is aware of footer
    this.store
      .select('appState')
      .pipe(pluck('media', 'canplay'), filter(value => value === true))
      .subscribe(() => {
        this.displayFooter = 'active';
        this.content.resize();
      });

    // Updating the Seekbar based on currentTime
    this.store
      .select('appState')
      .pipe(
        pluck('media', 'timeSec'),
        filter(value => value !== undefined),
        map((value: any) => Number.parseInt(value)),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.seekbar.setValue(value);
      });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
  }

  next() {
    let index = this.currentFile.index + 1;
    let file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    let index = this.currentFile.index - 1;
    let file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }
}
