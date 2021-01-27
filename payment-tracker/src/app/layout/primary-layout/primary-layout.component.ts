import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { EnvelopeService } from 'src/app/services/envelope.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';
import { UserAddPaymentService } from 'src/app/services/user-add-payment.service';
import { UserPaymentService } from 'src/app/services/user-payment.service';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-primary-layout',
  templateUrl: './primary-layout.component.html',
  styleUrls: ['./primary-layout.component.css']
})
export class PrimaryLayoutComponent implements OnInit{
  @ViewChild(HeaderComponent) headerData;

  dropdownAppear = false;
  d = new Date();
  year = this.d.getFullYear();
  userPaymentModalActivated = false;
  userAddPaymentModalActivated = false;

  student;
  students = [];
  classes = [];
  payments = [];
  sidebarAppear = false;
  studentRoute = false;
  paymentRoute = false;
  reportRoute = false;
  teacherRoute = false;
  classRoute = false;
  selectedStudent = '';

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
  modalActivated = false;

  username = localStorage.getItem('username');

  constructor(
    private envelopeService: EnvelopeService,
    private onPageNotificationService: OnPageNotificationService,
    private userPaymentService: UserPaymentService,
    private authService: AuthService,
    private router: Router,
    private dataTransferService: DataTransferService,
    private userAddPaymentService: UserAddPaymentService
  ) { }

  ngOnInit(): void {
    this.dataTransferService.activatedEmitter.subscribe(data => {
      this.modalActivated = data.modal;
    });
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
      setTimeout(() => {
        this.onPageNotifActivated = false;
      }, 10000);
    });
    this.userPaymentService.activatedEmitter.subscribe(data => {
      console.log(data);
      // this.sidebarAppear = false;
      this.modalActivated = data.status;
      this.userPaymentModalActivated = data.status;
    });
    this.userAddPaymentService.activatedEmitter.subscribe(data => {
      this.modalActivated = data.status;
      this.userAddPaymentModalActivated = data.status;
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
    if (this.studentRoute) {
      this.sidebarAppear = false;
      this.router.navigate(['home/students']);
    }
  }

  toPaymentRoute(): void {
    if (this.paymentRoute) {
      this.sidebarAppear = false;
      this.router.navigate(['home/payment']);
    }
  }

  toReportRoute(): void {
    if (this.reportRoute) {
      this.sidebarAppear = false;
      this.router.navigate(['home/report']);
    }
  }

  toTeacherRoute(): void {
    if (this.teacherRoute) {
      this.sidebarAppear = false;
      this.router.navigate(['home/teachers']);
    }
  }

  toClassRoute(): void {
    if (this.classRoute) {
      this.sidebarAppear = false;
      this.router.navigate(['home/classes']);
    }
  }
  onSelectionChange(e): void {
    // console.log(e);
    let studentId = this.students.filter(v => {
      return e.value === v.username;
    });
    studentId = studentId[0].id;
    this.authService.getPaymentByUser(studentId).subscribe(
      (res) => {
        this.payments = res.payments.map(v => ({
          id: v._id,
          amount: v.amount,
          class: this.displayClassName(v.class_id)
        }));
      }
    );
  }

  displayClassName(id): any {
    const selectedClass = this.classes.filter((v) => {
      return v.id === id;
    });
    return selectedClass[0].name;
  }

  onCloseModal(): void {
    this.modalActivated = false;
    this.dataTransferService.activatedEmitter.next({
      modal: false
    });
  }

  onOpenModal(e): void {
    // console.log(e);
    e.stopPropagation();
    this.modalActivated = true;
    this.dataTransferService.activatedEmitter.next({
      modal: true
    });
  }
}
