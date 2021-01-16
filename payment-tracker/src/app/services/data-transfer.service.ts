import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataTransferService {
    activatedEmitter = new Subject<any>();
}
