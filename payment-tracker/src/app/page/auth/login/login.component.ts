import { HttpHeaders } from '@angular/common/http';
import { AfterViewChecked, AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  inputType = 'password';
  passwordAppear = true;
  username = 'victor';
  password = 'Spin1043';
  loginError = false;
  notifText = '';
  settingsUpdated = false;
  something = '22';
  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private dataTransferService: DataTransferService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('settingsUpdated')) {
      this.notifSuccess();
    }
    // this.changeDetectorRef.detach();
    // this.changeDetectorRef.detectChanges();
    // this.dataTransferService.activatedEmitter.subscribe(res => {
    //     this.notifSuccess(res);
    //     this.changeDetectorRef.detectChanges();
    //     this.changeDetectorRef.markForCheck();
    //     console.log('LINE 36, 20000% OOOOOOO What a geniusssssss');
    //   }
    // );
  }

  ngAfterViewChecked(): void {
  }

  ngAfterContentChecked(): void {

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
          console.log(res);
          if (res.type === 'success') {
            this.storeToken(res.token, res.username, res.google, res.facebook, JSON.stringify(res.permissions));
            this.router.navigate(['/home']);
          } else {
            this.notifText = res.message;
            this.loginError = true;
            this.settingsUpdated = false;
          }
        }, (err) => {
          console.log('ERROR');
        }
      );
    } else {
      this.notifText = 'Input invalid';
      this.loginError = true;
      this.settingsUpdated = false;
      return false;
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

  storeToken(token, username, google, facebook, permissions): void {
    if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('google', google);
      localStorage.setItem('facebook', facebook);
      localStorage.setItem('permissions', permissions);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('google');
      localStorage.removeItem('facebook');
      localStorage.removeItem('permissions');
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('google', google);
      localStorage.setItem('facebook', facebook);
      localStorage.setItem('permissions', permissions);
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
              this.storeToken(result.token, result.username, result.google, result.facebook, JSON.stringify(result.permissions));
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
              this.storeToken(result.token, result.username, result.google, result.facebook, JSON.stringify(result.permissions));
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

  notifSuccess(): void {
      this.notifText = 'Settings updated, please log in again';
      this.settingsUpdated = true;
      console.log(this.settingsUpdated);
      this.something = '30';
      localStorage.removeItem('settingsUpdated');
  }
}


