import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    endpoint = 'http://localhost:8500';
    data = {};

    login(user, pass): any {
        this.data = {
            username: user,
            password: pass
        };
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
        return this.http.post(`${this.endpoint}/api/google/register`, this.data);
    }

    bindFacebook(emailAdd, photoUrl, emailName, emailId): any {
        this.data = {
            email: emailAdd,
            name: emailName,
            photo_url: photoUrl,
            id: emailId
        };
        return this.http.post(`${this.endpoint}/api/facebook/register`, this.data);
    }

    unbindGoogle(): any {
        return this.http.post(`${this.endpoint}/api/google/unbind`, this.data);
    }

    unbindFacebook(): any {
        return this.http.post(`${this.endpoint}/api/facebook/unbind`, this.data);
    }

    logOut(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('google');
        localStorage.removeItem('facebook');
        localStorage.removeItem('permissions');
        this.router.navigate(['/login']);
    }

    loginGoogle(emailAddress): any {
        this.data = {
            email: emailAddress
        };
        return this.http.post(`${this.endpoint}/api/google/login`, this.data);
    }

    loginFacebook(emailAddress): any {
        this.data = {
            email: emailAddress
        };
        return this.http.post(`${this.endpoint}/api/facebook/login`, this.data);
    }

    checkPermission(): any {
        return this.http.post(`${this.endpoint}/api/permission/check`, this.data);
    }

    getAllTeachers(): any {
        return this.http.post(`${this.endpoint}/api/teachers/list`, this.data);
    }

    deleteTeacher(index): any {
        this.data = {
            id: +index
        };
        return this.http.post(`${this.endpoint}/api/teachers/delete`, this.data);
    }

    getStudentById(index): any {
        this.data = {
            id: +index
        };
        return this.http.post(`${this.endpoint}/api/students/id`, this.data);
    }

    changeStudentsData(index, user, pass): any {
        this.data = {
            id: +index,
            username: user,
            password: pass
        };
        return this.http.post(`${this.endpoint}/api/students/data/change`, this.data);
    }

    getAllStudents(): any {
        return this.http.post(`${this.endpoint}/api/students/list`, this.data);
    }

    deleteStudent(index): any {
        this.data = {
            id: +index
        };
        return this.http.post(`${this.endpoint}/api/students/delete`, this.data);
    }

    getTeacherById(index): any {
        this.data = {
            id: +index
        };
        return this.http.post(`${this.endpoint}/api/teachers/id`, this.data);
    }

    changeTeacherData(index, user, pass): any {
        this.data = {
            id: +index,
            username: user,
            password: pass
        };
        return this.http.post(`${this.endpoint}/api/teachers/data/change`, this.data);
    }

    getAllClasses(user): any {
        this.data = {
            teacher: user
        };
        return this.http.post(`${this.endpoint}/api/classes/list`, this.data);
    }

    addClass(obj): any {
        return this.http.post(`${this.endpoint}/api/classes/add`, obj);
    }

    getClassById(index): any {
        this.data = {
            id: +index
        };
        return this.http.post(`${this.endpoint}/api/classes/id`, this.data);
    }

    changeClassData(obj): any {
        return this.http.post(`${this.endpoint}/api/classes/data/change`, obj);
    }

    deleteClass(index): any {
        this.data = {
            id: +index
        };
        return this.http.post(`${this.endpoint}/api/classes/delete`, this.data);
    }

    addStudent(user, pass): any {
        this.data = {
            username: user,
            password: pass
        };
        return this.http.post(`${this.endpoint}/api/students/add`, this.data);
    }

    addTeacher(user, pass): any {
        this.data = {
            username: user,
            password: pass
        };
        return this.http.post(`${this.endpoint}/api/teachers/add`, this.data);
    }

    getClassInfo(index): any {
        this.data = {
            class: +index
        };
        return this.http.post(`${this.endpoint}/api/classes/students`, this.data);
    }

    changeClassStudentStatus(obj): any {
        return this.http.post(`${this.endpoint}/api/classes/students/change`, obj);
    }
}
