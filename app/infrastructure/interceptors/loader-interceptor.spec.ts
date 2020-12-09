import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs/operators';

import { LoaderInterceptor } from './loader-interceptor';

describe('LoaderInterceptorService', () => {
    let loaderService: LoaderService;
    let http: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoaderInterceptor,
                LoaderService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: LoaderInterceptor,
                    multi: true
                }
            ],
            imports: [HttpClientTestingModule]
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        loaderService = TestBed.inject(LoaderService);
    });

    it('should be created', () => {
        const service: LoaderInterceptor = TestBed.inject(LoaderInterceptor);
        expect(service).toBeTruthy();
    });

    it('should assing a true value to isLoading meanwhile the request is executed', async(() => {
        let isLoading = false;

        loaderService.isLoading.subscribe(res => {
            isLoading = res;
        });

        // Make an HTTP GET request
        http.get<any>('/data').subscribe();

        expect(isLoading).toEqual(true);

        const req = httpMock.expectOne('/data');
        req.flush('hola');
        httpMock.verify();
    }));

    it('should assing a false value to isLoading after the request is executed', async(() => {
        let isLoading = false;

        loaderService.isLoading.subscribe(res => {
            isLoading = res;
        });

        // Make an HTTP GET request
        http.get<any>('/data').subscribe(res => {
            expect(isLoading).toEqual(false);
        });

        expect(isLoading).toEqual(true);

        const req = httpMock.expectOne('/data');
        req.flush('hola');
        httpMock.verify();
    }));
});
