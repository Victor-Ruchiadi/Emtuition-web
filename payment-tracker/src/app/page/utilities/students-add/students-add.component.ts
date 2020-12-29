import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';

@Component({
  selector: 'app-students-add',
  templateUrl: './students-add.component.html',
  styleUrls: ['./students-add.component.css']
})
export class StudentsAddComponent implements OnInit {

  username = '';
  password = '';
  passwordAppear = true;
  inputType = 'password';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private onPageNotificationService: OnPageNotificationService
  ) { }

  ngOnInit(): void {}

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
    this.authService.addStudent(this.username, this.password).subscribe(
      (res) => {
        if (res.type === 'error') {
          this.onActivateNotification('danger', res.message);
        } else {
          this.onActivateNotification('success', res.message);
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
