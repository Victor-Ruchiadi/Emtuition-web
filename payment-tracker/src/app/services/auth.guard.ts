import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        // your  logic goes here
        let permit = false;
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
            return false;
        }
        if (
            window.location.pathname === '/' ||
            window.location.pathname === '/login' ||
            window.location.pathname === '/home' ||
            window.location.pathname === '/home/settings'
        ) {
            return true;
        }
        if (localStorage.getItem('permissions')) {
            const permissions = JSON.parse(localStorage.getItem('permissions'));
            console.log(permissions);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < permissions.length; i++) {
                if (
                    permissions[i].permission_id === 1 &&
                    permissions[i].can_read === true &&
                    window.location.pathname === '/home/students'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 1 &&
                    permissions[i].can_update === true &&
                    window.location.pathname === '/home/students/add'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 1 &&
                    permissions[i].can_update === true
                ) {
                    const pathArray = window.location.pathname.split('/');
                    const studentId = pathArray[3];
                    if (window.location.pathname === '/home/students/' + studentId) {
                        permit = true;
                        return true;
                    }
                }
                if (permissions[i].permission_id === 2 &&
                    permissions[i].can_read === true &&
                    window.location.pathname === '/home/payment'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 3 &&
                    permissions[i].can_read === true &&
                    window.location.pathname === '/home/report'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 4 &&
                    permissions[i].can_read === true &&
                    window.location.pathname === '/home/teachers'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 4 &&
                    permissions[i].can_update === true &&
                    window.location.pathname === '/home/teachers/add'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 4 &&
                    permissions[i].can_update === true
                ) {
                    const pathArray = window.location.pathname.split('/');
                    const teacherId = pathArray[3];
                    console.log(pathArray);
                    if (window.location.pathname === '/home/teachers/' + teacherId) {
                        permit = true;
                        return true;
                    }
                }
                if (permissions[i].permission_id === 5 &&
                    permissions[i].can_read === true &&
                    window.location.pathname === '/home/classes'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 5 &&
                    permissions[i].can_update === true &&
                    window.location.pathname === '/home/classes/add'
                ) {
                    // alert('permit');
                    permit = true;
                    return true;
                }
                if (permissions[i].permission_id === 5 &&
                    permissions[i].can_update === true
                ) {
                    const pathArray = window.location.pathname.split('/');
                    const classId = pathArray[3];
                    if (window.location.pathname === '/home/classes/' + classId) {
                        permit = true;
                        return true;
                    }
                }
                if (permissions[i].permission_id === 5 &&
                    permissions[i].can_update === true
                ) {
                    const pathArray = window.location.pathname.split('/');
                    const classId = pathArray[5];
                    if (window.location.pathname === '/home/classes/add/students/' + classId) {
                        permit = true;
                        return true;
                    }
                }
            }
            if (!permit) {
                this.router.navigate(['/home']);
                return false;
            }
            console.log(window.location.pathname, 'window.location.pathname');
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}
