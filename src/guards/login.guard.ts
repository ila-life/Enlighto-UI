import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import * as firebase from 'firebase';

@Injectable({
  providedIn: "root"
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, ) {}
  async canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          console.log('User is logged in');
          resolve(true);
        } else {
          console.log('User is not logged in');
          this.router.navigateByUrl('/login');
          resolve(false);
        }
      });
    });
  }
}
