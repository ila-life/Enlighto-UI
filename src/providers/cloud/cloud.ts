import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class CloudProvider {
  files: any = [
    {
      url: 'http://drive.google.com/uc?export=view&id=10xdzKy6qTePm4IkUU8VkaJRDVB7VVXcA',
      name: 'Perfect by Ed Sheeran'
    },
    {
      url: 'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
      name: 'Man Atkeya Beparwah by Nusrat Fateh Ali Khan'
    },
    {
      url: 'http://drive.google.com/uc?export=view&id=1gE7v-0P4JC7xR95pjuxXzKcErgnE_ttb',
      name: 'Confusing Facts'
    },
    {
      url: 'http://drive.google.com/uc?export=view&id=1nZinEKhU5TIOiAG2b2BjpUg39fmLPFEL',
      name: 'Jijonte paratta voice'
    }
  ];
  getFiles() {
    return of(this.files);
  }
}
