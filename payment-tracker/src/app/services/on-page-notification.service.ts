import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OnPageNotificationService {
    activatedEmitter = new Subject<any>();
}
