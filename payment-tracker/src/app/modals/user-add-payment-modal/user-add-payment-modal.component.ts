import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';
import { UserAddPaymentService } from 'src/app/services/user-add-payment.service';
import { FormControl } from '@angular/forms';
import { OwlDateTimeComponent, DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeFormats } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parseInput: 'MM/YYYY',
  fullPickerInput: 'l LT',
  datePickerInput: 'MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-user-add-payment-modal',
  templateUrl: './user-add-payment-modal.component.html',
  styleUrls: ['./user-add-payment-modal.component.css'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
  ],
})
export class UserAddPaymentModalComponent implements OnInit {
  paymentsDate = [];
  desc = [];
  lastAmountAppear = false;
  classes = [];
  payments = [];
  selectedStudent = '';
  student;
  students = [];
  modalActivated = false;
  paymentsDateDisplay = false;
  paymentsLog = [];
  constructor(
    private authService: AuthService,
    private userAddPaymentService: UserAddPaymentService,
    private dataTransferService: DataTransferService,
    private onPageNotificationService: OnPageNotificationService
  ) { }

  ngOnInit(): void {
    this.authService.getAllCLassesName().subscribe(
      (res) => {
        this.classes = res.classes.map(v => ({
          id: v._id,
          name: v.name
        }));
      }
    );

    this.authService.getAllStudents().subscribe(
      (res) => {
        res.forEach(v => {
          this.student = {
            id: v._id,
            username: v.username
          };
          this.students.push(this.student);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    this.userAddPaymentService.activatedEmitter.subscribe(data => {
      console.log(data);
      // const date = new FormControl(moment());
      const today = _moment().format('MMMM YYYY');
      // console.log(date);
      // const today = moment();
      this.desc = [];
      this.paymentsDateDisplay = false;
      this.paymentsDate = [];
      this.lastAmountAppear = false;
      this.selectedStudent = data.student;
      let studentId = this.students.filter(v => {
        return this.selectedStudent === v.username;
      });
      studentId = studentId[0].id;
      this.authService.getPaymentByUser(+studentId).subscribe(
        (res) => {
          console.log(res);
          this.payments = res.payments.map(v => ({
            id: v._id,
            amount: v.amount,
            inputAmount: v.amount,
            class: this.displayClassName(v.class_id),
            lastAmount: this.lastAmountValue(v)
          }));
          const paymentsId = [];
          this.payments.forEach(v => {
            console.log(v);
            this.desc.push('');
            paymentsId.push(v.id);
          });
          console.log('desc', this.desc);
          console.log(paymentsId);
          if (paymentsId.length > 0) {
            this.getStudentPaymentLog(paymentsId);
          }
          this.paymentsDateDisplay = true;
        }
      );
      this.modalActivated = data.status;
    });
  }

  lastAmountValue(v): number {
    if (v.last_amount) {
      this.lastAmountAppear = true;
      return v.last_amount;
    }
  }

  onSelectionChange(e): void {
    this.desc = [];
    this.paymentsDateDisplay = false;
    // const today = _moment().format('MMMM YYYY');
    this.paymentsDate = [];
    this.lastAmountAppear = false;
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
          inputAmount: v.amount,
          class: this.displayClassName(v.class_id),
          lastAmount: this.lastAmountValue(v)
        }));
        const paymentsId = [];
        this.payments.forEach(v => {
          console.log(v);
          this.desc.push('');
          paymentsId.push(v.id);
        });
        console.log(paymentsId);
        if (paymentsId.length > 0) {
          this.getStudentPaymentLog(paymentsId);
        }
        this.paymentsDateDisplay = true;
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
    this.paymentsDate = [];
  }

  onOpenModal(e): void {
    // console.log(e);
    e.stopPropagation();
    this.modalActivated = true;
    this.dataTransferService.activatedEmitter.next({
      modal: true
    });
  }

  onActivateNotification(type, txt): void {
    this.onPageNotificationService.activatedEmitter.next({
      status: true,
      color: type,
      text: txt
    });
  }

  onClickAdd(i): void {
    const obj = {
      id: this.paymentsLog[i].id,
      amount: this.payments[i].amount,
      desc: this.desc[i],
      date: this.paymentsDate[i]
    };
    this.authService.addStudentPayment(obj).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getStudentPaymentLog(paymentsId): void {
    this.authService.getStudentPaymentLog(paymentsId).subscribe(
      (res) => {
        console.log(res);
        const lastPayments = [];
        this.paymentsLog = res.studentPaymentLog.map(v => ({
          id: v._id,
          payment_id: v.payment_id
        }));
        console.log(this.paymentsLog);
        res.studentPaymentLog.forEach(v => {
          if (v.payments[v.payments.length - 1]) {
            lastPayments.push(v.payments[v.payments.length - 1].payment_date);
          } else {
            lastPayments.push('');
          }
        });
        console.log(lastPayments);
        this.displayPaymentDate(lastPayments);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  displayPaymentDate(lastPayments): void {
    this.paymentsDate = [];
    console.log(this.paymentsDate);
    console.log(lastPayments);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lastPayments.length; i++) {
      // tslint:disable-next-line:quotemark
      if (lastPayments[i] !== "") {
        const splitted = lastPayments[i].split(' ');
        // console.log(splitted);
        splitted[0] = moment().month(splitted[0]).format('M');
        const format = splitted[0] + ' ' + splitted[1];
        const month = _moment(format, 'MM YYYY').add(1, 'M').format('MMMM YYYY');
        console.log(month);
        this.paymentsDate.push(month);
      } else {
        const today = _moment().format('MMMM YYYY');
        this.paymentsDate.push(today);
      }
    }
    console.log(this.paymentsDate);
  }
}
