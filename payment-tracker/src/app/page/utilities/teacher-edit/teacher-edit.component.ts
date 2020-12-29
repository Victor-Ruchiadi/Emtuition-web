import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';


@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.css']
})
export class TeacherEditComponent implements OnInit {

  teacherId = this.activatedRoute.snapshot.paramMap.get('id');
  username = '';
  originalUsername = '';
  password = '';
  passwordAppear = true;
  inputType = 'password';
  usernameData = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private onPageNotificationService: OnPageNotificationService
  ) { }

  ngOnInit(): void {
    this.authService.getTeacherById(this.teacherId).subscribe(
      (res) => {
        console.log(res);
        this.username = res.username;
        this.originalUsername = res.username;

      }, (err) => {
        console.log(err);
      }
    );
  }

  changeType(): void {
    this.passwordAppear = !this.passwordAppear;
    if (this.passwordAppear === true) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }

  onSubmit(): any {
    if (!this.onValidate()) {
      this.onActivateNotification('danger', 'The username or password is invalid');
    }
    if (this.originalUsername === this.username) {
        this.usernameData = '';
    } else {
      this.usernameData = this.username;
    }
    this.authService.changeTeacherData(this.teacherId, this.usernameData, this.password).subscribe(
      (res) => {
        if (res.type === 'error') {
          this.onActivateNotification('danger', res.message);
        } else {
          this.onActivateNotification('success', res.message);
          this.authService.getTeacherById(this.teacherId).subscribe(
            (result) => {
              this.originalUsername = result.username;

            }, (err) => {
              console.log(err);
            }
          );
        }
      },
      (err) => {
        this.onActivateNotification('danger', 'Some errors occured');
      }
    );
  }

  onValidate(): boolean {
    if (this.username.length >= 3 && isNaN(+this.username.charAt(0))) {
      return true;
    }
    if (this.password !== '') {
      if (this.password.length >= 6) {
        return true;
      }
    }
    if (this.password === '') {
      return true;
    }
    else {
      return false;
    }
  }

  onActivateNotification(type, txt): void {
    this.onPageNotificationService.activatedEmitter.next({
      status: true,
      color: type,
      text: txt
    });
  }
}
