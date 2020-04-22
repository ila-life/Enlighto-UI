import { Component } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AuthenticateService } from "../services/authenticate.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage {
  validations_form: FormGroup;
  errorMessage: string = "";

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private storage: Storage
  ) {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      )
    });
  }

  validation_messages = {
    email: [
      { type: "required", message: "Email is required" },
      { type: "pattern", message: "Invalid email id" }
    ],
    password: [
      { type: "required", message: "Password is required" },
      {
        type: "minlength",
        message: "The password must have at least 5 characters"
      }
    ]
  };

  loginUser(value) {
    this.authService
      .loginUser(value)
      .then(user => {
        if (user) {
          this.navCtrl.navigateForward("/");
        } else {
          this.errorMessage = "User does not exist";
        }
      })
      .catch(error => {
        this.errorMessage = error;
      });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward("/register");
  }
}
