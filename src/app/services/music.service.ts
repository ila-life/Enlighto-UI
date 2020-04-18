import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  BASE_API_URL = 'https://enlighto-api.herokuapp.com';
  constructor() {}

  getList() {
    return fetch(`${this.BASE_API_URL}/list`).then(
      response => response.json()
    );
  }

  getSongs(category) {
    return fetch(`${this.BASE_API_URL}/songs?category=${category}`).then(
      response => response.json()
    );
  }

  getCategories() {
    return fetch(`${this.BASE_API_URL}/categories`).then( response => response.json());
  }
}
