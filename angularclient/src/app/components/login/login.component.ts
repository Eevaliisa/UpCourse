import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BasicAuthenticationService} from "../../services/security/basic-authentication.service";
import {AppComponent} from "../../app.component";
import {UserService} from "../../services/users/user.service";
import {Role} from "../../common/role";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username;
  password;
  invalidLogin = false;
  clickRegister: boolean = false;
  clickResetPassword: boolean = false;
  loggedUserRoles: Role[];

  constructor(private router: Router,
              public basicAuthenticationService : BasicAuthenticationService,
              private appComponent: AppComponent,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.router.navigateByUrl(`/login`);
  }

  handleBasicAuthLogin() {
      this.basicAuthenticationService.executeBasicAuthenticationService(this.username, this.password)
        .subscribe(
          data => {
            console.log(data)
            this.router.navigate(['courses', this.username])
            this.invalidLogin = false;
          },
          error => {
            console.log(error)
            this.invalidLogin = true;
          }
        )
    }

  handleJwtAuthLogin() {
    this.basicAuthenticationService.executeJwtAuthenticationService(this.username, this.password)
      .subscribe(
        data => {

          this.loggedUserRoles = data.authorities;
          this.appComponent.getLoggedUserRoles();

          if (this.checkRoles()) {
            this.router.navigate(['courses']);
          } else {
            this.router.navigate(['calendar']);
          }

          this.invalidLogin = false;
        },
        error => {
          console.log(error)
          this.invalidLogin = true;
        }
      )
  }

    clickedRegister(){
    this.clickRegister = true;
    }

    clickedResetPassword(){
    this.clickResetPassword = true;
  }


    checkRoles(): boolean {
      for (let tempRole of this.loggedUserRoles) {
        if (tempRole.authority === 'ROLE_ADMIN') {
          return true;
        }
      }
      return false;
    }

}

