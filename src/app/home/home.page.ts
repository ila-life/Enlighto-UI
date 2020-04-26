import { Component } from '@angular/core';
import { MusicControls } from '@ionic-native/music-controls/ngx';

import { MusicService } from '../services/music.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { SongsModalPage } from '../songs-modal/songs-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  onSeekState: boolean;
  categories: any[] = [];
  songs: any[] = [];
  nowPlaying: any = {};
  progress = 0;
  pausedTime = 0;
  playing = false;
  currentSong: any = {};

  constructor(
    private musicService: MusicService,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private musicControls: MusicControls
  ) { }

  musicControlInit() {
    this.musicControls.create({
      track: this.currentSong.title,
      artist: this.currentSong.artist,
      isPlaying: this.nowPlaying.isPlaying,

      duration: this.nowPlaying.duration,
      elapsed: 0,
      ticker: this.currentSong.title,

      playIcon: 'play',
      pauseIcon: 'pause',
      prevIcon: 'skip-backward',
      nextIcon: 'skip-forward',
      notificationIcon: 'notification'
    });

    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;
      switch (message) {
        case 'music-controls-next':
          this.next()
          break;
        case 'music-controls-previous':
          this.previous()
          break;
        case 'music-controls-pause':
          this.pause()
          break;
        case 'music-controls-play':
          this.play(null);
          break;
        default:
          break;
      }
    });

    this.musicControls.listen(); // activates the observable above

    this.musicControls.updateIsPlaying(true);
  }

  async ionViewDidEnter() {
    this.categories = await this.musicService.getCategories();
  }

  play(song) {
    this.currentSong = song ? song : this.currentSong;
    const previewUrl = this.currentSong.url;
    if (!previewUrl) {
      return;
    }
    this.nowPlaying = new Audio(previewUrl);
    this.musicControlInit()
    this.nowPlaying.addEventListener('timeupdate', () => {
      this.progress = (this.nowPlaying.currentTime / this.nowPlaying.duration);
      this.musicControls.updateElapsed({ elapsed: this.progress, isPlaying: this.playing })
    });
    this.nowPlaying.addEventListener('ended', () => {
      this.next();
    });
    this.nowPlaying.play();
    this.nowPlaying.currentTime = this.pausedTime;
    this.updateIsPlaying(true);
  }

  pause() {
    if (this.nowPlaying) {
      this.nowPlaying.pause();
    }

    this.pausedTime = this.nowPlaying.currentTime;
    this.updateIsPlaying(false);
  }

  getCurrentSongIndex() { return this.songs.findIndex(x => x.url === this.currentSong.url); }

  isFirstPlaying() {
    return this.getCurrentSongIndex() === 0;
  }

  isLastPlaying() {
    return this.getCurrentSongIndex() === this.songs.length - 1;
  }

  fastforward() {
    this.nowPlaying.currentTime = this.nowPlaying.currentTime + 5;
  }

  rewind() {
    this.nowPlaying.currentTime = this.nowPlaying.currentTime - 5;
  }

  next() {
    if (this.isLastPlaying()) {
      return;
    }
    const nextSong = this.songs[this.getCurrentSongIndex() + 1];
    this.reset();
    this.play(nextSong);
  }

  previous() {
    if (this.isFirstPlaying()) {
      return;
    }
    const previousSong = this.songs[this.getCurrentSongIndex() - 1];
    this.reset();
    this.play(previousSong);
  }

  reset() {
    if (this.playing) {
      this.nowPlaying.pause();
    }
    this.currentSong = {};
    this.progress = this.pausedTime = this.nowPlaying.currentTime = 0;
    this.updateIsPlaying(false);
  }

  updateIsPlaying(isPlaying) {
    this.playing = isPlaying;
    this.musicControls.updateIsPlaying(isPlaying);
  }

  parseTime(time = '0.00') {
    if (time) {
      const partTime = parseInt(time.toString().split('.')[0], 10);

      let minutes = Math.floor(partTime / 60).toString();
      if (minutes.length === 1) {
        minutes = '0' + minutes;
      }
      let seconds = (partTime % 60).toString();
      if (seconds.length === 1) {
        seconds = '0' + seconds;
      }
      return minutes + ':' + seconds;
    }
  }

  async showSongs(category) {
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
    const songs = await this.musicService.getSongs(category);
    const modal = await this.modalController.create({
      component: SongsModalPage,
      componentProps: {
        songs,
        title: 'Category'
      }
    });
    loading.dismiss();

    modal.onDidDismiss().then(({ data: selectedSong }) => {
      if (selectedSong) {
        this.songs = songs;
        this.reset();
        this.currentSong = selectedSong;
        this.play(selectedSong);
      }
    });

    return await modal.present();
  }
}
