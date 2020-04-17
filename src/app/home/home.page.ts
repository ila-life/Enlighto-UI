import { Component } from '@angular/core';
import { MusicService } from '../services/music.service';
import { ModalController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  onSeekState: boolean;
  songs: any[] = [];
  nowPlaying: any = {};
  progress = 0;
  pausedTime = 0;
  playing = false;
  currentSong: any = {};

  constructor(
    private musicService: MusicService,
    public modalController: ModalController,
    public loadingController: LoadingController
  ) { }

  async ionViewDidEnter() {
    this.songs = await this.musicService.getList();
  }

  play(song) {
    this.currentSong = song ? song : this.currentSong;
    const previewUrl = this.currentSong.url;
    if (!previewUrl) {
      return;
    }
    this.nowPlaying = new Audio(previewUrl);
    this.nowPlaying.addEventListener('timeupdate', () => {
      this.progress = (this.nowPlaying.currentTime / this.nowPlaying.duration);
    });
    this.nowPlaying.play();
    this.nowPlaying.currentTime = this.pausedTime;
    this.playing = true;
  }

  pause() {
    if (this.nowPlaying) {
      this.nowPlaying.pause();
    }

    this.pausedTime = this.nowPlaying.currentTime;
    this.playing = false;
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
    this.playing = false;
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
}
