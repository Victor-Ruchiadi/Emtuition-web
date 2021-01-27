import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/auth/login/login.component';
import { PlainLayoutComponent } from './layout/plain-layout/plain-layout.component';
import { PrimaryLayoutComponent } from './layout/primary-layout/primary-layout.component';
import { SidebarComponent } from './layout/primary-layout/components/sidebar/sidebar.component';
import { HeaderComponent } from './layout/primary-layout/components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotFoundPageComponent } from './page/utilities/not-found-page/not-found-page.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './page/utilities/settings/settings.component';
import { TokenInterceptor } from './middleware/token.interceptor';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { StudentsComponent } from './page/utilities/students/students.component';
import { PaymentComponent } from './page/utilities/payment/payment.component';
import { ReportComponent } from './page/utilities/report/report.component';
import { TeacherComponent } from './page/utilities/teacher/teacher.component';
import { TeacherEditComponent } from './page/utilities/teacher-edit/teacher-edit.component';
import { StudentsEditComponent } from './page/utilities/students-edit/students-edit.component';
import { ClassesComponent, TooltipListPipe } from './page/utilities/classes/classes.component';
import { ClassesAddComponent } from './page/utilities/classes-add/classes-add.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { ClassesEditComponent } from './page/utilities/classes-edit/classes-edit.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StudentsAddComponent } from './page/utilities/students-add/students-add.component';
import { TeacherAddComponent } from './page/utilities/teacher-add/teacher-add.component';
import { IgxExcelModule } from 'igniteui-angular-excel';
import { IgxSpreadsheetModule } from 'igniteui-angular-spreadsheet';
import { ClassesAddStudentsComponent } from './page/utilities/classes-add-students/classes-add-students.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserPaymentModalComponent } from './modals/user-payment-modal/user-payment-modal.component';
import { UserAddPaymentModalComponent } from './modals/user-add-payment-modal/user-add-payment-modal.component';
import { NgMonthPickerModule } from 'ng-month-picker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlainLayoutComponent,
    PrimaryLayoutComponent,
    SidebarComponent,
    HeaderComponent,
    NotFoundPageComponent,
    SettingsComponent,
    StudentsComponent,
    PaymentComponent,
    ReportComponent,
    TeacherComponent,
    TeacherEditComponent,
    StudentsEditComponent,
    ClassesComponent,
    ClassesAddComponent,
    ClassesEditComponent,
    StudentsAddComponent,
    TeacherAddComponent,
    ClassesAddStudentsComponent,
    TooltipListPipe,
    UserPaymentModalComponent,
    UserAddPaymentModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule,
    FormsModule,
    SocialLoginModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    MatSelectModule,
    Ng2SearchPipeModule,
    IgxExcelModule,
    IgxSpreadsheetModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgMonthPickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '324775637611-40t2d96tarbd8m1enmp6q2prr7u5loca.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('409796160212001')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
