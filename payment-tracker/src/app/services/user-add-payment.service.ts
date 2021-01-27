import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserAddPaymentService {
    activatedEmitter = new Subject<any>();
}
