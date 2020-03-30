import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class CloudProvider {
  files:any = [
    {
      url: 'http://drive.google.com/uc?export=view&id=10xdzKy6qTePm4IkUU8VkaJRDVB7VVXcA',
      name: 'Perfect by Ed Sheeran'
    },
    {
      url: 'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
      name: 'Man Atkeya Beparwah by Nusrat Fateh Ali Khan'
    },
    { url: 'https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3',
      name: 'Penny Lane by The Beatles'
    }
  ];
  getFiles() {
    return of(this.files);
  }
}
