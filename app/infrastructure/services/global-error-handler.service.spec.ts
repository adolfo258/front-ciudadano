import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandler } from './global-error-handler.service';

describe('GlobalErrorHandlerService', () => {
    let service: GlobalErrorHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GlobalErrorHandler]
        });
        service = TestBed.inject(GlobalErrorHandler);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should capture a client error', () => {
        expect(() => {
            service.handleError(new Error());
        }).toThrow();
    });
});
