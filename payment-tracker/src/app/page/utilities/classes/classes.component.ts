import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnPageNotificationService } from 'src/app/services/on-page-notification.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  searchText = '';
  class = {};
  classes = [];
  canUpdate = false;
  // searchText = '';
  permissions = JSON.parse(localStorage.getItem('permissions'));

  constructor(private authService: AuthService, private onPageNotificationService: OnPageNotificationService) { }

  ngOnInit(): void {
    this.authService.getAllClasses().subscribe(
      (res) => {
        res.forEach(v => {
          this.class = {
            id: v._id,
            name: v.name
          };
          this.classes.push(this.class);
        });
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
}
