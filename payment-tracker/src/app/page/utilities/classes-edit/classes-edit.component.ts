import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';

@Component({
  selector: 'app-classes-edit',
  templateUrl: './classes-edit.component.html',
  styleUrls: ['./classes-edit.component.css']
})
export class ClassesEditComponent implements OnInit {
  teacher = {};
  teachers = [];
  selectedTeacher = '';
  userIsAdmin = false;
  classId = this.activatedRoute.snapshot.paramMap.get('id');

  class = '';
  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  sunday = false;
  teacherId;

  mondayTime = [];
  mondayTimeSplit = [];
  mondayNewTime = '';

  tuesdayTime = [];
  tuesdayTimeSplit = [];
  tuesdayNewTime = '';

  wednesdayTime = [];
  wednesdayTimeSplit = [];
  wednesdayNewTime = '';

  thursdayTime = [];
  thursdayTimeSplit = [];
  thursdayNewTime = '';

  fridayTime = [];
  fridayTimeSplit = [];
  fridayNewTime = '';

  saturdayTime = [];
  saturdayTimeSplit = [];
  saturdayNewTime = '';

  sundayTime = [];
  sundayTimeSplit = [];
  sundayNewTime = '';

  week = [];
  weekTime = [];
  weekTimeSplit = [];
  weekNewTime = [];

  time;
  times = [];
  timeSplit;

  constructor(
    private onPageNotificationService: OnPageNotificationService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authService.getAllTeachers().subscribe(
      (res) => {
        console.log(res);
        if (res.roleId === 1) {
          this.userIsAdmin = true;
        }
        if (res.roleId === 2) {
          this.selectedTeacher = res.username;
          console.log(this.selectedTeacher);
        }
        res.teachers.forEach(v => {
          this.teacher = {
            id: v._id,
            username: v.username
          };
          this.teachers.push(this.teacher);
        });
        console.log(this.teachers, 'teachers');
      },
      (err) => {
        console.log(err);
      }
    );

    this.authService.getClassById(this.classId).subscribe(
      (res) => {
        this.teachers.forEach(v => {
          if (v.id === res._id) {
            console.log(v.username);
            this.selectedTeacher = v.username;
            console.log(v.id);
            this.teacherId = v.id;
          }
        });
        this.class = res.name;
        this.week = [
          res.monday_has_class,
          res.tuesday_has_class,
          res.wednesday_has_class,
          res.thursday_has_class,
          res.friday_has_class,
          res.saturday_has_class,
          res.sunday_has_class
        ];
        this.weekTime = [
          res.monday_class_time,
          res.tuesday_class_time,
          res.wednesday_class_time,
          res.thursday_class_time,
          res.friday_class_time,
          res.saturday_class_time,
          res.sunday_class_time
        ];
        this.changeBackFormat(this.weekTime);
      },
      (err) => {
        console.log(err);
      }
    );
    this.weekTimeSplit = [
      this.mondayTimeSplit,
      this.tuesdayTimeSplit,
      this.wednesdayTimeSplit,
      this.thursdayTimeSplit,
      this.fridayTimeSplit,
      this.saturdayTimeSplit,
      this.sundayTimeSplit
    ];

    this.weekNewTime = [
      this.mondayNewTime,
      this.tuesdayNewTime,
      this.wednesdayNewTime,
      this.thursdayNewTime,
      this.fridayNewTime,
      this.saturdayNewTime,
      this.sundayNewTime
    ];
  }

  onSubmit(): any {
    if (this.class === '') {
      this.onActivateNotification('danger', 'Class name is required');
      return false;
    }
    this.changeFormat();
    const details = {
      id: this.classId,
      teacher_id: this.teacherId,
      name: this.class,
      monday: this.week[0],
      monday_class: this.weekNewTime[0],
      tuesday: this.week[1],
      tuesday_class: this.weekNewTime[1],
      wednesday: this.week[2],
      wednesday_class: this.weekNewTime[2],
      thursday: this.week[3],
      thursday_class: this.weekNewTime[3],
      friday: this.week[4],
      friday_class: this.weekNewTime[4],
      saturday: this.week[5],
      saturday_class: this.weekNewTime[5],
      sunday: this.week[6],
      sunday_class: this.weekNewTime[6],
    };
    this.authService.changeClassData(details).subscribe(
      (res) => {
        console.log(res);
        if (res.type === 'error') {
          this.onActivateNotification('danger', res.message);
        } else {
          this.onActivateNotification('success', res.message);

        }
      }, (err) => {
        this.onActivateNotification('danger', 'Some errors occured');
      }
    );
  }

  changeFormat(): any {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.weekTime.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.weekTime[i].length; j++) {
        let time = this.weekTime[i][j].toString().split(' ')[4];
        time = time.slice(0, time.length - 3);
        this.weekTimeSplit[i].push(time);
      }
      if (this.week[i] === false) {
        this.weekTime[i] = '';
      }
      if (this.weekTimeSplit[i][0] && this.weekTime[i][1]) {
        this.weekNewTime[i] = this.weekTimeSplit[i][0] + '-' + this.weekTimeSplit[i][1];
      }
      else if (this.weekTimeSplit[i][0] && !this.weekTimeSplit[i][1]) {
        this.weekNewTime[i] = this.weekTimeSplit[i][0] + '-' + this.weekTimeSplit[i][0];
      }
      else if (!this.weekTimeSplit[i][0] && this.weekTimeSplit[i][1]) {
        this.weekNewTime[i] = this.weekTimeSplit[i][1] + '-' + this.weekTimeSplit[i][1];
      }
      else {
        this.week[i] = false;
        this.weekNewTime[i] = '';
      }
    }
    this.teachers.forEach(v => {
      if (v.username === this.selectedTeacher) {
        this.teacherId = v.id;
      }
    });
  }

  changeBackFormat(week): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i  = 0; i < week.length; i++) {
      if (week[i] !== '') {
        this.times = [];
        this.time = week[i].split('-');
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0 ; j < this.time.length; j++) {
          const d = new Date();
          this.timeSplit = this.time[j].split(':');
          d.setHours(+this.timeSplit[0], +this.timeSplit[1]);
          // console.log(d);
          this.times.push(d);
        }
        week[i] = this.times;
      }
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
