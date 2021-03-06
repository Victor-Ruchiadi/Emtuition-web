import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  userIsAdmin = false;
  tableActive = true;
  loaded = false;
  teacherId;
  currentClassId;
  teacherSelected = false;
  classSelected = false;
  studentSelected = false;
  selectedTeacherValue = '';
  selectedClassValue = '';
  selectedStudentValue = '';
  selectedStudentId;
  teachers = [];
  classes = [];
  students = [];
  studentData;
  tableContent = 'Classes';
  monthSelected;
  studentCanDisplay = false;
  payment = {
    classes: [],
    classUserPayment: [],
    studentPaymentLog: []
  };

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getAllPayments().subscribe(
      (res) => {
        this.payment.classes = res.classes.map(v => ({
          id: v._id,
          teacher_id: v.teacher_id,
          name: v.name,
          amount: 0
        }));
        this.payment.classUserPayment = res.classUserPayment.map(v => ({
          id: v._id,
          class_id: v.class_id,
          student_id: v.student_id
        }));
        this.payment.studentPaymentLog = res.studentPaymentLog.map(v => ({
          id: v._id,
          payment_id: v.payment_id,
          payments: v.payments
        }));
        this.payment.classes.forEach(v => {
          v.amount = this.getClassAmount(v.id);
        });
        if (res.roleId === 2) {
          this.teacherId = res.teacher;
          this.getAllClass(res.teacher);
          this.monthSelected = moment().format('MMMM YYYY');
          this.loaded = true;
        } else {
          this.getAllTeachers();
        }
        console.log(this.payment);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllTeachers(): void {
    this.authService.getAllTeachers().subscribe(
      (res) => {
        // console.log(res);
        if (res.roleId === 1) {
          this.userIsAdmin = true;
          this.tableContent = 'Teachers';
        }
        this.teachers = res.teachers.map(v => ({
          id: v._id,
          username: v.username,
          amount: this.getTeacherAmount(v._id)
        }));
        this.monthSelected = moment().format('MMMM YYYY');
        this.loaded = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllClass(id): void {
    this.classes = this.payment.classes.filter(v => {
      return id === v.teacher_id;
    });
    console.log(this.classes);
    const teacher = this.teachers.filter(v => {
      return v.id === id;
    });
    console.log(teacher);
    if (teacher.length !== 0) {
      this.selectedTeacherValue = teacher[0].username;
      this.teacherSelected = true;
    }
    this.tableContent = 'Classes';
  }

  getAllStudents(id): void {
    this.currentClassId = id;
    this.authService.getClassInfo(id).subscribe(
      (res) => {
        console.log(res);
        this.students = res.selectedStudents.map(v => ({
          id: v._id,
          username: v.username,
          amount: this.getStudentAmount(v._id, id)
        }));
        // console.log(this.students);
        const classSelected = this.classes.filter(v => {
          return v.id === id;
        });
        this.selectedClassValue = classSelected[0].name;
        this.classSelected = true;
        this.tableContent = 'Students';
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goToMain(): void {
    this.tableActive = true;
    this.teacherSelected = false;
    this.classSelected = false;
    if (this.userIsAdmin) {
      this.tableContent = 'Teachers';
    } else {
      this.tableContent = 'Classes';
    }
  }

  goToTeacher(): void {
    this.tableActive = true;
    this.classSelected = false;
    this.tableContent = 'Classes';
  }

  goToClass(): void {
    this.tableActive = true;
    this.studentSelected = false;
    this.tableContent = 'Students';
  }

  getClassAmount(classId): number {
    const payment = this.payment.classUserPayment.filter(v => {
      return classId === v.class_id;
    });
    console.log(payment);
    const paymentId = [];
    payment.forEach(v => {
      paymentId.push(v.id);
    });
    const payments = this.payment.studentPaymentLog.filter(v => {
      return paymentId.includes(v.payment_id);
    });
    console.log(payments);
    let amount = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].payments.length > 0) {
        payments[i].payments.forEach(v => {
          if (v.payment_date === this.monthSelected) {
            amount += v.payment_amount;
          }
        });
      }
    }
    return amount;
  }

  getStudentAmount(studentId, classId): number {
    const payment = this.payment.classUserPayment.filter(v => {
      return studentId === v.student_id && classId === v.class_id;
    });
    const paymentId = [];
    payment.forEach(v => {
      paymentId.push(v.id);
    });
    const payments = this.payment.studentPaymentLog.filter(v => {
      return paymentId.includes(v.payment_id);
    });
    let amount = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].payments.length > 0) {
        payments[i].payments.forEach(v => {
          if (v.payment_date === this.monthSelected) {
            amount += v.payment_amount;
          }
        });
      }
    }
    return amount;
  }

  getTeacherAmount(teacherId): number {
    let amount = 0;
    const classes = this.payment.classes.filter(v => {
      return v.teacher_id === teacherId;
    });
    classes.forEach(v => {
      amount += v.amount;
    });
    return amount;
  }

  changeMonth(): void {
    if (this.userIsAdmin) {
      this.payment.classes.forEach(v => {
        v.amount = this.getClassAmount(v.id);
      });
      this.students.forEach(v => {
        v.amount = this.getStudentAmount(v.id, this.currentClassId);
      });
      this.teachers.forEach(v => {
        v.amount = this.getTeacherAmount(v.id);
      });
    } else {
      this.getAllClass(this.teacherId);
      this.payment.classes.forEach(v => {
        v.amount = this.getClassAmount(v.id);
      });
      this.students.forEach(v => {
        v.amount = this.getStudentAmount(v.id, this.currentClassId);
      });
    }
    if (this.studentCanDisplay === true) {
      const classes = this.getClassByStudent(this.selectedStudentId);
      const amountClass = [];
      classes.classesId.forEach(v => {
        amountClass.push(this.getStudentAmount(this.selectedStudentId, v));
      });
      this.studentData.amount = amountClass;
    }
  }

  studentOverview(id): void {
    this.authService.getStudentById(id).subscribe(
      (res) => {
        console.log(res);
        this.selectedStudentValue = res.username;
        this.selectedStudentId = res._id;
        const classes = this.getClassByStudent(res._id);
        const amountClass = [];
        classes.classesId.forEach(v => {
          amountClass.push(this.getStudentAmount(res._id, v));
        });
        this.studentData = {
          id: res._id,
          username: res.username,
          created_date: res.created_date,
          role: 'Student',
          classes: classes.array,
          classesId: classes.classesId,
          amount: amountClass
        };
        this.studentCanDisplay = true;
        this.studentSelected = true;
        console.log(this.studentData);
      },
      (err) => {
        console.log(err);
      }
    );
    this.tableActive = false;
  }

  getClassByStudent(id): any {
    const classUserPayment = this.payment.classUserPayment.filter(v => {
      return id === v.student_id;
    });
    const classesId = [];
    classUserPayment.forEach(v => {
      classesId.push(v.class_id);
    });
    const classes = this.payment.classes.filter(v => {
      return classesId.includes(v.id);
    });
    const array = [];
    classes.forEach(v => {
      array.push(v.name);
    });
    return {array, classesId};
  }
}
