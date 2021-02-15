import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    endpoint = 'http://localhost:8500';
    data = {};
    tokenExpirationTimer;

    login(user, pass): any {
        this.data = {
            username: user,
            password: pass
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/login`, this.data);
    }

    changePassword(user, password1, password2): any {
        this.data = {
            username: user,
            old_password: password1,
            new_password: password2
        };
        return this.http.post(`${this.endpoint}/api/password/change`, this.data);
    }

    bindGoogle(emailAdd, idToken, photoUrl, emailName, emailId): any {
        this.data = {
            email: emailAdd,
            name: emailName,
            photo_url: photoUrl,
            id: emailId,
            id_token: idToken
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/google/register`, this.data);
    }

    bindFacebook(emailAdd, photoUrl, emailName, emailId): any {
        this.data = {
            email: emailAdd,
            name: emailName,
            photo_url: photoUrl,
            id: emailId
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/facebook/register`, this.data);
    }

    unbindGoogle(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/google/unbind`, this.data);
    }

    unbindFacebook(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/facebook/unbind`, this.data);
    }

    logOut(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('google');
        localStorage.removeItem('facebook');
        localStorage.removeItem('permissions');
        this.router.navigate(['/login']);
        // this.router.navigate(['/login']).then(() => {
            // window.location.reload();
        // });
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogOut(): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, 7200000);
    }

    loginGoogle(emailAddress): any {
        this.data = {
            email: emailAddress
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/google/login`, this.data);
    }

    loginFacebook(emailAddress): any {
        this.data = {
            email: emailAddress
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/facebook/login`, this.data);
    }

    checkPermission(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/permission/check`, this.data);
    }

    getAllTeachers(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/teachers/list`, this.data);
    }

    deleteTeacher(index): any {
        this.data = {
            id: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/teachers/delete`, this.data);
    }

    getStudentById(index): any {
        this.data = {
            id: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/students/id`, this.data);
    }

    changeStudentsData(index, user, pass): any {
        this.data = {
            id: +index,
            username: user,
            password: pass
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/students/data/change`, this.data);
    }

    getAllStudents(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/students/list`, this.data);
    }

    deleteStudent(index): any {
        this.data = {
            id: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/students/delete`, this.data);
    }

    getTeacherById(index): any {
        this.data = {
            id: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/teachers/id`, this.data);
    }

    changeTeacherData(index, user, pass): any {
        this.data = {
            id: +index,
            username: user,
            password: pass
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/teachers/data/change`, this.data);
    }

    getAllClasses(user): any {
        this.data = {
            teacher: user
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/list`, this.data);
    }

    addClass(obj): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/add`, obj);
    }

    getClassById(index): any {
        this.data = {
            id: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/id`, this.data);
    }

    changeClassData(obj): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/data/change`, obj);
    }

    deleteClass(index): any {
        this.data = {
            id: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/delete`, this.data);
    }

    addStudent(user, pass): any {
        this.data = {
            username: user,
            password: pass
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/students/add`, this.data);
    }

    addTeacher(user, pass): any {
        this.data = {
            username: user,
            password: pass
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/teachers/add`, this.data);
    }

    getClassInfo(index): any {
        this.data = {
            class: +index
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/students`, this.data);
    }

    changeClassStudentStatus(obj): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/students/change`, obj);
    }

    getAllUserPayment(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/payment`, this.data);
    }

    changePaymentAmount(obj): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/payment/change`, obj);
    }

    getAllCLassesName(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/classes/name`, this.data);
    }

    getPaymentByUser(userId): any {
        this.data = {
            student: +userId
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/payment/user`, this.data);
    }

    getStudentPaymentLog(payment): any {
        this.data = {
            payments: payment
        };
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/payment/students/log`, this.data);
    }

    addStudentPayment(obj): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/payment/students/add`, obj);
    }

    getAllPayments(): any {
        this.autoLogOut();
        return this.http.post(`${this.endpoint}/api/payment/all`, this.data);
    }
}
