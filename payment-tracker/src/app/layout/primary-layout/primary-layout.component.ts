import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EnvelopeService } from 'src/app/services/envelope.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-primary-layout',
  templateUrl: './primary-layout.component.html',
  styleUrls: ['./primary-layout.component.css']
})
export class PrimaryLayoutComponent implements OnInit{
  @ViewChild(HeaderComponent) headerData;

  dropdownAppear = false;

  sidebarAppear = false;

  studentRoute = false;
  paymentRoute = false;
  reportRoute = false;
  teacherRoute = false;
  classRoute = false;

  permissions = JSON.parse(localStorage.getItem('permissions'));

  infoColor = '#62bfe3';
  successColor = '#68bb91';
  warningColor = '#cd924c';
  dangerColor = '#f55a4e';
  primaryColor = '#576cc3';

  envActivated = false;
  envBgColor = '';
  envText = '';

  onPageNotifActivated = false;
  onPageNotifBgColor = '';
  onPageNotifText = '';

  username = localStorage.getItem('username');

  constructor(
    private envelopeService: EnvelopeService,
    private onPageNotificationService: OnPageNotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.envelopeService.activatedEmitter.subscribe(data => {
      this.envActivated = data.status;
      // this.envBgColor = data.color;
      this.envBgColor = this.checkColor(data.color);
      this.envText = data.text;
    });
    this.onPageNotificationService.activatedEmitter.subscribe(data => {
      this.onPageNotifActivated = data.status;
      // this.onPageNotifBgColor = data.color;
      this.onPageNotifBgColor = this.checkColor(data.color);
      this.onPageNotifText = data.text;
    });
    if (this.permissions) {
      this.permissions.forEach(v => {
        if (v.permission_id === 1) {
          this.studentRoute = true;
        }
        if (v.permission_id === 2) {
          this.paymentRoute = true;
        }
        if (v.permission_id === 3) {
          this.reportRoute = true;
        }
        if (v.permission_id === 4) {
          this.teacherRoute = true;
        }
        if (v.permission_id === 5) {
          this.classRoute = true;
        }
      });
    }
  }

  checkColor(notifColor): string {
    if (notifColor === 'info') {
      return this.infoColor;
    }
    if (notifColor === 'danger') {
      return this.dangerColor;
    }
    if (notifColor === 'success') {
      return this.successColor;
    }
    if (notifColor === 'warning') {
      return this.warningColor;
    }
    if (notifColor === 'primary') {
      return this.primaryColor;
    }
  }

  logOut(): void {
    this.dropdownAppear = !this.dropdownAppear;
    this.authService.logOut();
  }

  toStudentsRoute(): void {
    this.router.navigate(['home/students']).then(() => {
      window.location.reload();
    });
  }

  toPaymentRoute(): void {
    this.router.navigate(['home/payment']).then(() => {
      window.location.reload();
    });
  }

  toReportRoute(): void {
    this.router.navigate(['home/report']).then(() => {
      window.location.reload();
    });
  }

  toTeacherRoute(): void {
    this.router.navigate(['home/teachers']).then(() => {
      window.location.reload();
    });
  }

  toClassRoute(): void {
    this.router.navigate(['home/classes']).then(() => {
      window.location.reload();
    });
  }
}
