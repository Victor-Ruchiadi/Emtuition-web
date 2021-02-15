import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  thisMonth = moment().format('MMM D YYYY');
  classUserPayment = [];
  classes = [];
  studentPaymentLog = [];
  students = [];
  notPaid = [];
  studentsDisplay = [];
  lastTwoMonthsPayment = [];
  lastMonthPayment = [];
  thisMonthPayment = [];
  lastThreeMonths = [
    moment().subtract(2, 'M').format('MMMM YYYY'),
    moment().subtract(1, 'M').format('MMMM YYYY'),
    moment().format('MMMM YYYY')
  ];
  lastThreeMonthsPayments = [false, false, false];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAllPayments().subscribe(
      (res) => {
        this.classUserPayment = res.classUserPayment.map(v => ({
          id: v._id,
          student_id: v.student_id,
          class_id: v.class_id,
        }));
        // console.log(this.classUserPayment);
        this.classes = res.classes.map(v => ({
          id: v._id,
          name: v.name
        }));
        // console.log(this.classes);
        this.studentPaymentLog = res.studentPaymentLog.map(v => ({
          id: v._id,
          payment_id: v.payment_id,
          payments: v.payments,
          created_date: v.created_date,
          month_needed: this.checkMonthsNeeded(v.created_date),
          color: 'green'
        }));
        // console.log(this.studentPaymentLog);
        this.getAllStudents();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllStudents(): void {
    this.authService.getAllStudents().subscribe(
      (res) => {
        this.students = res.map(v => ({
          id: v._id,
          username: v.username
        }));
        // console.log(this.students);
        for (let i = 0; i < this.studentPaymentLog.length; i++ ) {
          this.studentPaymentLog[i].not_paid = this.checkPaidOrNot(i);
        }
        console.log(this.studentPaymentLog);
        this.studentPaymentLog.forEach(v => {
          v.color = this.checkColor(v.not_paid);
        });
        this.displayStudents();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkPaidOrNot(i): void {
    const paymentsDate = [];
    this.studentPaymentLog[i].payments.forEach(v => {
      paymentsDate.push(v.payment_date);
    });
    const monthNeeded = this.studentPaymentLog[i].month_needed;
    // console.log(paymentsDate);
    // console.log(monthNeeded);
    const notPaid = monthNeeded.filter(v => {
      return !paymentsDate.includes(v);
    });
    return notPaid;
    // console.log(notPaid);
  }

  checkMonthsNeeded(createdDate): any {
    const monthLimit = moment().add(1 , 'M');
    createdDate = createdDate.split('-');
    const format = moment(createdDate[1] + ' ' + createdDate[0], 'MM YYYY');
    const array = [];
    for (monthLimit; monthLimit.isAfter(format, 'month'); format.add('1', 'M')) {
      array.push(format.format('MMMM YYYY'));
    }
    return array;
  }

  checkColor(monthNeeded): string {
    if (monthNeeded.length === 0) {
      return '#52a77d';
    }
    if (monthNeeded.length === 1) {
      return '#ffcc00';
    }
    if (monthNeeded.length >= 2) {
      return '#f55a4e';
    }
  }

  displayStudents(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.classUserPayment.length; i++) {
      const info = this.getPaymentInfo(this.classUserPayment[i].id);
      const obj = {
        student_name: this.displayStudentName(this.classUserPayment[i].student_id),
        class_name: this.displayClassName(this.classUserPayment[i].class_id),
        not_paid: info[0].not_paid,
        color: info[0].color
      };
      this.studentsDisplay.push(obj);
    }
    this.studentsDisplay.forEach(v => {
      v.not_paid.forEach(val => {
        if (val === this.lastThreeMonths[0]) {
          this.lastTwoMonthsPayment.push({
            student: v.student_name,
            class: v.class_name
          });
        }
        if (val === this.lastThreeMonths[1]) {
          this.lastMonthPayment.push({
            student: v.student_name,
            class: v.class_name
          });
        }
        if (val === this.lastThreeMonths[2]) {
          this.thisMonthPayment.push({
            student: v.student_name,
            class: v.class_name
          });
        }
      });
    });
  }

  displayStudentName(studentId): string {
    const name = this.students.filter(v => {
      return v.id === studentId;
    });
    return name[0].username;
  }

  displayClassName(classId): string {
    const name = this.classes.filter(v => {
      return v.id === classId;
    });
    return name[0].name;
  }

  getPaymentInfo(id): object {
    const payment = this.studentPaymentLog.filter(v => {
      return id === v.payment_id;
    });
    return payment;
  }
}
