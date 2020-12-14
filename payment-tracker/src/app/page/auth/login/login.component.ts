import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  inputType = 'password';
  passwordAppear = true;
  username = 'victor';
  password = 'Spin1043';

  constructor(private authService: AuthService, private router: Router, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
  }

  changeType(): any {
    this.passwordAppear = !this.passwordAppear;
    if (this.passwordAppear === true) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }

  onSubmit(): any {
    if (this.validate()) {
      this.authService.login(this.username, this.password).subscribe(
        (res) => {
          this.storeToken(res.token, res.username, res.google, res.facebook);
          this.router.navigate(['/home']);
        }, (err) => {
          console.log('ERROR');
        }
      );
    } else {
      console.log('FAILLLLLL');
      return false;
      // Later notif
    }
  }

  validate(): boolean {
    let valid = true;

    switch (true) {
      case !this.username || this.username.length < 3 || !isNaN(+this.username.charAt(0)):
      case !this.password || this.password.length < 6:
        valid = false;
        break;
    }
    return valid;
  }

  storeToken(token, username, google, facebook): void {
    if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('google', google);
      localStorage.setItem('facebook', facebook);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('google');
      localStorage.removeItem('facebook');
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('google', google);
      localStorage.setItem('facebook', facebook);
    }
  }

  googleLogin(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (res) => {
        this.authService.loginGoogle(res.email).subscribe(
          (result) => {
            if (result.type === 'error') {
              this.signOut();
            } else {
              this.storeToken(result.token, result.username, result.google, result.facebook);
              this.router.navigate(['/home']);
              this.signOut();
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  facebookLogin(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (res) => {
        this.authService.loginFacebook(res.email).subscribe(
          (result) => {
            if (result.type === 'error') {
              this.signOut();
            } else {
              this.storeToken(result.token, result.username, result.google, result.facebook);
              this.router.navigate(['/home']);
              this.signOut();
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  signOut(): void  {
    this.socialAuthService.signOut(true);
  }
}


