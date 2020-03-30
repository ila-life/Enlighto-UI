import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CloudProvider {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  getFiles() { return this.httpClient.get('https://enlighto-api.herokuapp.com/list') }
}
