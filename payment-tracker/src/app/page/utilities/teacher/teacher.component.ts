import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  teacher = {};
  searchText = '';
  teachers = [];
  canUpdate = false;
  permissions = JSON.parse(localStorage.getItem('permissions'));

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAllTeachers().subscribe(
      (res) => {
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
        if (v.permission_id === 1 && v.can_update === true) {
          this.canUpdate = true;
        }
      });
    }
  }

  deleteTeacher(index): void {
    const teacherId = this.teachers[index].id;
    this.authService.deleteTeacher(teacherId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    window.location.reload();
    }
}
