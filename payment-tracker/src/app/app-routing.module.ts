import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/auth/login/login.component';
import { PrimaryLayoutComponent } from './layout/primary-layout/primary-layout.component';
import { NotFoundPageComponent } from './page/utilities/not-found-page/not-found-page.component';
import { SettingsComponent } from './page/utilities/settings/settings.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: PrimaryLayoutComponent, canActivate: [AuthGuard] , children: [
    {path: 'settings', component: SettingsComponent}
  ]},
  { path: '**', component: NotFoundPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
