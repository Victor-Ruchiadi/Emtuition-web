import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';
import _ from 'lodash';
import { UserPaymentService } from 'src/app/services/user-payment.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments;
  paymentsInput = [];
  userPaymentModalActivated = false;

  loaded = false;
  student = {};
  students = [];
  paymentId = [];
  lastAmountAppear = false;
  lastAmount = [];
  searchText = '';
  canUpdate = false;
  canDelete = false;
  canCreate = false;
  permissions = JSON.parse(localStorage.getItem('permissions'));
  update = [];
  values = [];
  inputValues = [];
  classes = [];
  constructor(
    private authService: AuthService,
    private onPageNotificationService: OnPageNotificationService,
    private userPaymentService: UserPaymentService,
    private dataTransferService: DataTransferService
  ) { }

  ngOnInit(): void {
    this.dataTransferService.activatedEmitter.subscribe(data => {
      this.userPaymentModalActivated = data.modal;
    });
    this.authService.getAllStudents().subscribe(
      (res) => {
        res.forEach(v => {
          this.student = {
            id: v._id,
            username: v.username
          };
          this.students.push(this.student);
        });
        // this.students.forEach(v => {
        //   this.update.push(false);
        // });
        this.loaded = true;
      },
      (err) => {
        console.log(err);
      }
    );
    if (this.permissions) {
      this.permissions.forEach(v => {
        if (v.permission_id === 1 && v.can_update === true) {
          this.canUpdate = true;
        }
        if (v.permission_id === 1 && v.can_delete === true) {
          this.canDelete = true;
        }
        if (v.permission_id === 1 && v.can_update === true) {
          this.canCreate = true;
        }
      });
    }

    // this.authService.getAllCLassesName().subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.classes = res.classes.map(v => ({
    //       id: v._id,
    //       name: v.name
    //     }));
    //     console.log(this.classes);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );

    // this.authService.getAllUserPayment().subscribe(
    //   (res) => {
    //     console.log(res);
    //     res.userPayment.forEach(v => {
          // if (v.last_amount) {
          //   this.lastAmount.push(v.last_amount);
          //   this.lastAmountAppear = true;
          // } else {
          //   this.lastAmount.push('-');
          // }
    //       this.paymentId.push(v._id);
    //       this.values.push(v.amount);
    //       this.inputValues.push(v.amount);
    //     });
    //     this.payments = _.groupBy(res.userPayment, 'student_id');
    //     this.students.forEach(v => {
    //       this.displayAmountInput(this.payments[v.id]);
    //     });
    //     this.loaded = true;
    //     console.log(this.paymentsInput);
    //     console.log(this.payments);
    //     console.log(this.values);
    //     console.log(this.lastAmount);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  onUpdate(i): void {
    if (this.values[i] !== this.inputValues[i]) {
      const details = {
        id: this.paymentId[i],
        lastAmount: this.values[i],
        newAmount: this.inputValues[i]
      };
      this.authService.changePaymentAmount(details).subscribe(
        (res) => {
          if (res.type === 'success') {
            this.onActivateNotification('success', res.message);
            this.lastAmount[i] = details.lastAmount;
            this.lastAmountAppear = true;
          } else {
            this.onActivateNotification('danger', res.message);
          }
        }
      );
    }
    this.values[i] = this.inputValues[i];
    this.update[i] = false;
  }
  onActivateNotification(type, txt): void {
    this.onPageNotificationService.activatedEmitter.next({
      status: true,
      color: type,
      text: txt
    });
  }

  displayAmount(arr): any {
    const array = [];
    let str;
    arr.forEach(v => {
      str = v.amount + ' (' + this.displayClassName(v.class_id) + ')';
      array.push(str);
    });
    return array;
  }

  displayAmountInput(arr): any {
    const array = [];
    arr.forEach(v => {
      array.push({
        amount: v.amount,
        class: this.displayClassName(v.class_id)
      });
    });
    this.paymentsInput.push(array);
  }

  displayClassName(id): any {
    const selectedClass = this.classes.filter((v) => {
      return v.id === id;
    });
    return selectedClass[0].name;
  }

  activateModal(i): void {
    console.log(i);
    console.log(this.students);
    const studentName = this.students[i].username;
    this.userPaymentService.activatedEmitter.next({
      status: true,
      student: studentName
    });
    this.userPaymentModalActivated = true;
  }
}

