import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';
import _ from 'lodash';

@Pipe({ name: 'tooltipList' })
export class TooltipListPipe implements PipeTransform {

  transform(lines: string[]): string {

    let list = '';

    lines.forEach(line => {
      list += '• ' + line + '\n';
    });

    return list;
  }
}

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  searchText = '';
  students = [];
  studentsArr = [];
  studentsId = [];
  studentsName = [];
  arr = [];

  class = {};
  classes = [];
  classesStudents = [];
  canUpdate = false;
  canDelete = false;
  canCreate = false;
  teacher = {};
  teachers = [];
  selectedTeacher = '';
  selectedTeacherId;
  userIsAdmin = false;
  // searchText = '';
  permissions = JSON.parse(localStorage.getItem('permissions'));

  constructor(private authService: AuthService, private onPageNotificationService: OnPageNotificationService) { }

  ngOnInit(): void {
    this.authService.getAllTeachers().subscribe(
      (res) => {
        console.log(res);
        if (res.roleId === 1) {
          this.userIsAdmin = true;
          this.selectedTeacher = res.teachers[0].username;
          this.selectedTeacherId = res.teachers[0]._id;
        }
        this.getAllClass();
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
    if (this.permissions) {
      this.permissions.forEach(v => {
        if (v.permission_id === 5 && v.can_update === true) {
          this.canUpdate = true;
        }
        if (v.permission_id === 5 && v.can_delete === true) {
          this.canDelete = true;
        }
        if (v.permission_id === 5 && v.can_update === true) {
          this.canCreate = true;
        }
      });
    }
  }

  deleteClass(index): void {
    this.authService.deleteClass(index).subscribe(
      (res) => {
        if (res.type === 'error') {
          this.onActivateNotification('danger', res.message);
        } else {
          window.location.reload();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onActivateNotification(type, txt): void {
    this.onPageNotificationService.activatedEmitter.next({
      status: true,
      color: type,
      text: txt
    });
  }

  onSelectionChange(e): void {
    this.teachers.forEach(v => {
      if (v.username === e.value) {
        this.selectedTeacherId = v.id;
        this.selectedTeacher = v.username;
      }
    });
    this.getAllClass();
  }

  getAllClass(): void {
    this.authService.getAllClasses(this.selectedTeacherId).subscribe(
      (res) => {
        console.log(res);
        this.classesStudents = _.groupBy(res.classStudents, 'class_id');
        this.classes = res.classes.map(v => ({
          id: v._id,
          name: v.name
        }));
        console.log('this.classesStudents', this.classesStudents);
        this.students = _.groupBy(res.classUser, 'class_id');
        console.log(this.students);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  studentsUsername(id): any {
    let sNames = this.students[id];

    if (!sNames || !sNames.length) { return []; }
    sNames = sNames.map(v => v.username);

    if (sNames.length > 10) {
      const removed = sNames.splice(10, sNames.length - 10);
      sNames.splice(10, sNames.length - 10);
      const removedTotal = removed.length;
      sNames[10] = removedTotal + ' more';
    }
    return sNames;
  }
}
