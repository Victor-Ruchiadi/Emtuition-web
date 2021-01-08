import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';

@Component({
  selector: 'app-classes-add-students',
  templateUrl: './classes-add-students.component.html',
  styleUrls: ['./classes-add-students.component.css']
})
export class ClassesAddStudentsComponent implements OnInit {

  searchText1 = '';
  searchText2 = '';
  newestId;
  teacherId;
  originalAvailable = [];
  originalAdded = [];
  availableStudents = [];
  addedStudents = [];
  userIsAdmin = false;
  classId = this.activatedRoute.snapshot.paramMap.get('id');
  availableId = [];
  selectedId = [];

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
      },
      (err) => {
        console.log(err);
      }
    );
    console.log(this.classId);
    this.authService.getClassInfo(this.classId).subscribe(
      (res) => {
        console.log(res);
        res.availableStudents.forEach(v => {
          const obj = {
            _id: v._id,
            username: v.username
          };
          this.originalAvailable.push(obj);
          this.availableStudents.push(obj);
        });
        res.selectedStudents.forEach(v => {
          const obj = {
            _id: v._id,
            username: v.username
          };
          this.originalAdded.push(obj);
          this.addedStudents.push(obj);
        });
        this.teacherId = res.teacherId;
        this.newestId = res.newestId;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit(): any {
    this.availableId = [];
    this.selectedId = [];
    this.availableStudents.forEach(v => {
      this.availableId.push(v._id);
    });
    this.addedStudents.forEach(v => {
      this.selectedId.push(v._id);
    });
    const studentsAvailable = this.originalAvailable.filter(v => {
      return !this.availableId.includes(v._id);
    });
    const studentsSelected = this.originalAdded.filter(v => {
      return !this.selectedId.includes(v._id);
    });
    const details = {
      class: +this.classId,
      availableStudents: studentsAvailable,
      selectedStudents: studentsSelected,
      id: this.createIdArray(studentsAvailable)
    };
    // console.log(details);
    this.authService.changeClassStudentStatus(details).subscribe(
      (res) => {
        if (res.success) {
          this.authService.getClassInfo(this.classId).subscribe(
            (result) => {
              console.log(result);
              this.originalAvailable = [];
              result.availableStudents.forEach(v => {
                const obj = {
                  _id: v._id,
                  username: v.username
                };
                this.originalAvailable.push(obj);
              });
              this.originalAdded = [];
              result.selectedStudents.forEach(v => {
                const obj = {
                  _id: v._id,
                  username: v.username
                };
                this.originalAdded.push(obj);
              });
            },
            (err) => {
              console.log(err);
            }
          );
          this.onActivateNotification('success', res.message);
        } else {
          this.onActivateNotification('danger', res.message);
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

  changeToAdded(i): void {
    const newAdded = this.availableStudents[i];
    this.addedStudents.push(newAdded);
    this.availableStudents = this.availableStudents.filter(v => v._id !== newAdded._id);
  }

  changeToAvailable(i): void {
    const newAvailable = this.addedStudents[i];
    this.availableStudents.push(newAvailable);
    this.addedStudents = this.addedStudents.filter(v => v._id !== newAvailable._id);
  }

  createIdArray(s): any {
    console.log(s);
    const idArr = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < s.length; i++) {
      idArr.push(this.newestId);
      this.newestId += 1;
    }
    console.log(idArr);
    return idArr;
  }
}
