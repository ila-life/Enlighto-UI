import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  constructor() {}

  getList() {
    return fetch('https://enlighto-api.herokuapp.com/list').then(
      response => response.json()
    );
  }
}
