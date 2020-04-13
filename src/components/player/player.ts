import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { AudioProvider } from '../../providers/audio/audio';
import { FormControl } from '@angular/forms';
import { Content } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET } from '../../providers/store/store';
import { pluck, filter, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent {
  onSeekState: boolean;
  state: any = {};
  @ViewChild(Content) content: Content;

  @Input()
  currentFile: any = {};

  @Output()
  nextSong = new EventEmitter();

  @Output()
  previousSong = new EventEmitter();
  seekbar: FormControl = new FormControl("seekbar");

  constructor(
    public audioProvider: AudioProvider,
    private store: Store<any>
  ) {

  }

  ngOnInit() {
    this.store.select('appState').subscribe((value: any) => {
      this.state = { ...this.state, ...value.media };
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

        case 'ended':
          return this.next()

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
  }

  previous() {
    this.previousSong.emit()
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
