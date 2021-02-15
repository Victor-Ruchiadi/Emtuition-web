import { Component, OnInit } from '@angular/core';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { EnvelopeService } from 'src/app/services/envelope.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: SocialUser;
  loggedIn: boolean;

  section1 = true;
  section2 = true;

  inputType1 = 'password';
  passwordAppear1 = true;
  inputType2 = 'password';
  passwordAppear2 = true;
  inputType3 = 'password';
  passwordAppear3 = true;

  usernameVal = localStorage.getItem('username');
  pinVal = 123456;

  googleBinded = localStorage.getItem('google');
  facebookBinded = localStorage.getItem('facebook');

  form = {
    username : this.usernameVal,
    oldPassword: '',
    password : '',
    confirmPassword: '',
    pin : this.pinVal
  };

  constructor(
    private envelopeService: EnvelopeService,
    private onPageNotificationService: OnPageNotificationService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private dataTransferService: DataTransferService
  ) { }

  ngOnInit(): void {
  }

  changeSetting(): void {
    if (!this.validate()) {
      this.onActivate('danger', 'Invalid password');
      return;
    }
    else {
      this.authService.changePassword(this.form.username, this.form.oldPassword, this.form.password).subscribe(
        (res) => {
          console.log(res);
          this.onActivate('success', 'Settings updated');
          localStorage.setItem('settingsUpdated', 'success');
          this.authService.logOut();
        }, (err) => {
          console.log(err);
          this.onActivate('danger', 'Error occured');
        }
      );
    }
  }

  validate(): boolean {
    const { username, oldPassword, password, confirmPassword, pin } = this.form;
    // 1. validate general error (shared error)

    if (!username || !oldPassword || !password || !confirmPassword || !pin) { return false; }
    // 2. validate specific error
    // 2.1 validate username (length, cannot start with number)
    if (username.length >= 3 && isNaN(+username.charAt(0)) ) {
      return true;
    }
    // 2.2 validate password (length)
    if (password.length < 6) {
      return false;
    }
    if (oldPassword.length < 6) { return false; }
    // 2.3 validate password confirmation (length, must equal to password)
    if (confirmPassword.length < 6 && confirmPassword !== password) {
      return false;
    }
    // 2.4 validate pin (length)
    if (pin <= 999999 || pin.toString().length < 7 || isNaN(+pin)) {return false; }
    return true;
  }

  onActivate(type, txt): void {
    this.onPageNotificationService.activatedEmitter.next({
      status: true,
      color: type,
      text: txt
    });
    // setTimeout(() => {
    //   this.envelopeService.activatedEmitter.next({
    //     status: false,
    //     color: '',
    //     text: ''
    //   });
    // }, 3500);
  }

  changeType1(): void {
    this.passwordAppear1 = !this.passwordAppear1;
    if (this.passwordAppear1 === true) {
      this.inputType1 = 'password';
    } else {
      this.inputType1 = 'text';
    }
  }

  changeType2(): void {
    this.passwordAppear2 = !this.passwordAppear2;
    if (this.passwordAppear2 === true) {
      this.inputType2 = 'password';
    } else {
      this.inputType2 = 'text';
    }
  }

  changeType3(): void {
    this.passwordAppear3 = !this.passwordAppear3;
    if (this.passwordAppear3 === true) {
      this.inputType3 = 'password';
    } else {
      this.inputType3 = 'text';
    }
  }

  googleBind(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (res) => {
        this.authService.bindGoogle(res.email, res.idToken, res.photoUrl, res.name, res.id).subscribe(
          (result) => {
            console.log(result);
            this.authService.logOut();
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

  facebookBind(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (res) => {
        this.authService.bindFacebook(res.email, res.response.picture.data.url, res.name, res.id).subscribe(
          (result) => {
            console.log(result);
            this.authService.logOut();
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

  googleUnbind(): void {
    this.authService.unbindGoogle().subscribe(
      (res) => {
        this.signOut();
        this.authService.logOut();
      }, err => console.log(err)
    );
  }

  facebookUnbind(): void {
    this.authService.unbindFacebook().subscribe(
      (res) => {
        this.signOut();
        this.authService.logOut();
      }, err => console.log(err)
    );
  }

  signOut(): void { this.socialAuthService.signOut(true); }
}
