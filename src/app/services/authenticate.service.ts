import { Injectable } from '@angular/core';
// import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  constructor() { }

  signOut() {
    firebase.auth().signOut();
  }

  loginUser(credentials) {
    console.log(credentials, 'credentials');
    return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(res => res.user)
      .catch(err => { console.error(err) });
  }

  registerUser(credentials) {
    return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(res => res.user)
      .catch(err => { console.error(err) });
  }
}
