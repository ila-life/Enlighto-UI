import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { AuthenticateService } from "../services/authenticate.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage {
  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";

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
    ],
    firstname: [
      { type: "required", message: "Name is required" },
      {
        type: "minlength",
        message: "Name must have at least three letters."
      }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder
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
      ),
      firstname: new FormControl(
        "",
        Validators.compose([Validators.minLength(3), Validators.required])
      )
    });
  }

  tryRegister(value) {
    this.authService
      .registerUser(value)
      .then(a => {
        console.log(a);
        this.errorMessage = "";
        this.successMessage = "Your account has been created successfully.";
        setTimeout(() => {
          this.navCtrl.navigateForward("/login");
        }, 1000);
      })
      .catch(error => {
        this.errorMessage = error;
        this.successMessage = "";
      });
  }

  goToLoginPage() {
    this.navCtrl.navigateBack("/login");
  }
}
