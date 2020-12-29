import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/auth/login/login.component';
import { PrimaryLayoutComponent } from './layout/primary-layout/primary-layout.component';
import { NotFoundPageComponent } from './page/utilities/not-found-page/not-found-page.component';
import { SettingsComponent } from './page/utilities/settings/settings.component';
import { AuthGuard } from './services/auth.guard';
import { StudentsComponent } from './page/utilities/students/students.component';
import { PaymentComponent } from './page/utilities/payment/payment.component';
import { ReportComponent } from './page/utilities/report/report.component';
import { TeacherComponent } from './page/utilities/teacher/teacher.component';
import { TeacherEditComponent } from './page/utilities/teacher-edit/teacher-edit.component';
import { StudentsEditComponent } from './page/utilities/students-edit/students-edit.component';
import { ClassesComponent } from './page/utilities/classes/classes.component';
import { ClassesAddComponent } from './page/utilities/classes-add/classes-add.component';
import { ClassesEditComponent } from './page/utilities/classes-edit/classes-edit.component';
import { TeacherAddComponent } from './page/utilities/teacher-add/teacher-add.component';
import { StudentsAddComponent } from './page/utilities/students-add/students-add.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: PrimaryLayoutComponent, canActivate: [AuthGuard] , children: [
    { path: 'settings', component: SettingsComponent },
    { path: 'students', component: StudentsComponent },
    { path: 'students/add', component: StudentsAddComponent },
    { path: 'students/:id', component: StudentsEditComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'report', component: ReportComponent },
    { path: 'teachers', component: TeacherComponent },
    { path: 'teachers/add', component: TeacherAddComponent },
    { path: 'teachers/:id', component: TeacherEditComponent },
    { path: 'classes', component: ClassesComponent },
    { path: 'classes/add', component: ClassesAddComponent },
    { path: 'classes/:id', component: ClassesEditComponent }
  ]},
  { path: '**', component: NotFoundPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
