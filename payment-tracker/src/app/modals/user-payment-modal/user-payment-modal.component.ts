import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';
import { UserPaymentService } from 'src/app/services/user-payment.service';

@Component({
  selector: 'app-user-payment-modal',
  templateUrl: './user-payment-modal.component.html',
  styleUrls: ['./user-payment-modal.component.css']
})
export class UserPaymentModalComponent implements OnInit {
  update = [];
  lastAmountAppear = false;
  classes = [];
  payments = [];
  selectedStudent = '';
  student;
  students = [];
  userPaymentModalActivated = false;
  constructor(
    private authService: AuthService,
    private userPaymentService: UserPaymentService,
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

    this.userPaymentService.activatedEmitter.subscribe(data => {
      console.log(data);
      this.update = [];
      this.lastAmountAppear = false;
      this.userPaymentModalActivated = data.status;
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
          console.log(this.payments);
          this.payments.forEach(v => {
            this.update.push(false);
          });
          // console.log(this.payments);
        }
      );
    });
  }

  lastAmountValue(v): number {
    if (v.last_amount) {
      this.lastAmountAppear = true;
      return v.last_amount;
    }
  }

  onSelectionChange(e): void {
    this.update = [];
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
        this.payments.forEach(v => {
          this.update.push(false);
        });
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
    this.userPaymentModalActivated = false;
    this.dataTransferService.activatedEmitter.next({
      modal: false
    });
  }

  onOpenModal(e): void {
    // console.log(e);
    e.stopPropagation();
    this.userPaymentModalActivated = true;
    this.dataTransferService.activatedEmitter.next({
      modal: true
    });
  }

  onUpdate(i): void {
    if (this.payments[i].amount !== this.payments[i].inputAmount) {
      const details = {
        id: this.payments[i].id,
        lastAmount: this.payments[i].amount,
        newAmount: this.payments[i].inputAmount
      };
      this.authService.changePaymentAmount(details).subscribe(
        (res) => {
          if (res.type === 'success') {
            this.onActivateNotification('success', res.message);
            this.payments[i].lastAmount = details.lastAmount;
            this.lastAmountAppear = true;
          } else {
            this.onActivateNotification('danger', res.message);
          }
        }
      );
    }
    this.payments[i].amount = this.payments[i].inputAmount;
    this.update[i] = false;
  }

  onActivateNotification(type, txt): void {
    this.onPageNotificationService.activatedEmitter.next({
      status: true,
      color: type,
      text: txt
    });
  }
}
