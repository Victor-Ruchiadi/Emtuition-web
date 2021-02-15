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
  loaded = false;
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
        this.loaded = true;
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
          this.loaded = false;
          this.authService.getClassInfo(this.classId).subscribe(
            (result) => {
              console.log(result);
              this.originalAvailable = [];
              this.availableStudents = [];
              result.availableStudents.forEach(v => {
                const obj = {
                  _id: v._id,
                  username: v.username
                };
                this.originalAvailable.push(obj);
                this.availableStudents.push(obj);
              });
              this.originalAdded = [];
              this.addedStudents = [];
              result.selectedStudents.forEach(v => {
                const obj = {
                  _id: v._id,
                  username: v.username
                };
                this.originalAdded.push(obj);
                this.addedStudents.push(obj);
              });
              this.loaded = true;
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
    this.loaded = false;
    const alreadyAdded = this.originalAdded.filter(v => {
      return v._id === this.availableStudents[i]._id;
    });
    let newAdded;
    if (alreadyAdded.length > 0) {
      newAdded = {
        _id: this.availableStudents[i]._id,
        username: this.availableStudents[i].username
      };
    } else {
      newAdded = {
        _id: this.availableStudents[i]._id,
        username: this.availableStudents[i].username,
        newAdded: true
      };
    }
    this.addedStudents.push(newAdded);
    this.availableStudents = this.availableStudents.filter(v => v._id !== newAdded._id);
    this.loaded = true;
  }

  changeToAvailable(i): void {
    this.loaded = false;
    const alreadyAvailable = this.originalAvailable.filter(v => {
      return v._id === this.addedStudents[i]._id;
    });
    let newAvailable;
    if (alreadyAvailable.length > 0) {
      newAvailable = {
        _id: this.addedStudents[i]._id,
        username: this.addedStudents[i].username
      };
    } else {
      newAvailable = {
        _id: this.addedStudents[i]._id,
        username: this.addedStudents[i].username,
        newAdded: true
      };
    }
    console.log(newAvailable);
    this.availableStudents.push(newAvailable);
    this.addedStudents = this.addedStudents.filter(v => v._id !== newAvailable._id);
    this.loaded = true;
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

  displayAddedStudents(): any {
    const array = this.addedStudents.map(v => {
      return v.username;
    });
    return array;
  }

  displayAvailableStudents(): any {
    const array = this.availableStudents.map(v => {
      return v.username;
    });
    return array;
  }
}
