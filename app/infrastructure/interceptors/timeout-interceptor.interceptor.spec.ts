import { TestBed } from '@angular/core/testing';

import { TimeoutInterceptor } from './timeout-interceptor.interceptor';

describe('TimeoutService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    xit('should be created', () => {
        const service: TimeoutInterceptor = TestBed.inject(TimeoutInterceptor);
        expect(service).toBeTruthy();
    });
});
