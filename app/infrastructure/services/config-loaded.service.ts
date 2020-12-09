import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigLoadedService {
    configLoaded$ = new BehaviorSubject<boolean>(false);

    finalize() {
        this.configLoaded$.next(true);
    }

    isFinish(): Observable<boolean> {
        return this.configLoaded$.asObservable();
    }
}
