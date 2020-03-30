import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AudioProvider } from '../../providers/audio/audio';
import { Store } from '@ngrx/store';
import { CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET } from '../../providers/store/store';

@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent {
  onSeekState: boolean;
  state: any = {};

  @Input()
  currentFile: any = {};

  @Output()
  nextSong = new EventEmitter();

  @Output()
  previousSong = new EventEmitter();

  constructor(
    public audioProvider: AudioProvider,
    private store: Store<any>
  ) {

  }

  ionViewWillLoad() {
    this.store.select('appState')
      .subscribe((value: any) => {
        this.state = value.media;
      });
  }

  ngOnInit() {
    this.playStream(this.currentFile.file.url);
  }

  ngOnChanges() {
    this.playStream(this.currentFile.file.url);
  }

  resetState() {
    this.audioProvider.stop();
    this.store.dispatch({ type: RESET });
  }

  playStream(url) {
    this.resetState();
    this.state.playing = true;
    this.audioProvider.playStream(url).subscribe(event => {
      const audioObj = event.target;

      switch (event.type) {
        case 'canplay':
          return this.store.dispatch({ type: CANPLAY, payload: { value: true } });

        case 'loadedmetadata':
          return this.store.dispatch({
            type: LOADEDMETADATA,
            payload: {
              value: true,
              data: {
                time: this.audioProvider.formatTime(
                  audioObj.duration * 1000,
                  'HH:mm:ss'
                ),
                timeSec: audioObj.duration,
                mediaType: 'mp3'
              }
            }
          });

        case 'playing':
          return this.store.dispatch({ type: PLAYING, payload: { value: true } });

        case 'pause':
          return this.store.dispatch({ type: PLAYING, payload: { value: false } });

        case 'timeupdate':
          return this.store.dispatch({
            type: TIMEUPDATE,
            payload: {
              timeSec: audioObj.currentTime,
              time: this.audioProvider.formatTime(
                audioObj.currentTime * 1000,
                'HH:mm:ss'
              )
            }
          });

        case 'loadstart':
          return this.store.dispatch({ type: LOADSTART, payload: { value: true } });
      }
    });
  }

  pause() {
    this.state.playing = false;
    this.audioProvider.pause();
  }

  play() {
    this.state.playing = true;
    this.audioProvider.play();
  }

  stop() {
    this.audioProvider.stop();
  }

  next() {
    this.nextSong.emit();
    // let index = this.currentFile.index + 1;
    // let file = this.files[index];
    // this.openFile(file, index);
  }

  previous() {
    this.previousSong.emit()
    // let index = this.currentFile.index - 1;
    // let file = this.files[index];
    // this.openFile(file, index);
  }

  onSeekStart() {
    this.onSeekState = this.state.playing;
    if (this.onSeekState) {
      this.pause();
    }
  }

  onSeekEnd(event) {
    if (this.onSeekState) {
      this.audioProvider.seekTo(event.value);
      this.play();
    } else {
      this.audioProvider.seekTo(event.value);
    }
  }

}
