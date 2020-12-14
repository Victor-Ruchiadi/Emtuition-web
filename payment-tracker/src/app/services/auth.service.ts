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
}
