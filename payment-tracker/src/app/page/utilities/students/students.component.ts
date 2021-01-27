import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IgxSpreadsheetComponent } from 'igniteui-angular-spreadsheet';
import { ExcelUtility } from 'src/app/services/excel.utility';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild('spreadsheet', { read: IgxSpreadsheetComponent })
  public spreadsheet: IgxSpreadsheetComponent;

  student = {};
  students = [];
  searchText = '';
  canUpdate = false;
  canDelete = false;
  canCreate = false;
  permissions = JSON.parse(localStorage.getItem('permissions'));

  constructor(private authService: AuthService, private excelUtility: ExcelUtility) { }

  ngOnInit(): void {
    // const excelFile = '../../../assets/excel/Mandarin-3b.xlsm';
    // this.excelUtility.loadFromUrl(excelFile).then((w) => {
    //   console.log(w);
    //   this.spreadsheet.workbook = w;
    // });
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
  }

  deleteStudent(index): void {
    const studentId = this.students[index].id;
    this.authService.deleteStudent(studentId).subscribe(
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
