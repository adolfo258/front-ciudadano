import { TestBed } from '@angular/core/testing';

import { ConfigLoadedService } from './config-loaded.service';

describe('ConfigLoadedService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ConfigLoadedService = TestBed.inject(ConfigLoadedService);
        expect(service).toBeTruthy();
    });
});
