import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserPaymentService {
    activatedEmitter = new Subject<any>();
}
