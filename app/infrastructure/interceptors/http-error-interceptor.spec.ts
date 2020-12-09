import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { HttpErrorInterceptor } from './http-error-interceptor';
import { LoaderService } from '../services/loader.service';
import { Injectable } from '@angular/core';

// type should be of type typeof T but this causes "error TS2693: 'T' only refers to a type, but is being used as a value here",
// because the instance i not available during compile time --> using any to avoid issue
function getInterceptorInstance<T extends HttpInterceptor>(
    interceptors: HttpInterceptor[],
    type: any
): HttpInterceptor {
    let searchedInterceptor: HttpInterceptor = null;
    interceptors.forEach((interceptor: HttpInterceptor) => {
        if (interceptor instanceof type) {
            searchedInterceptor = interceptor;
        }
    });
    return searchedInterceptor;
}

describe('HttpErrorInterceptor', () => {
    let httpMock: HttpTestingController;
    let loaderService: LoaderService;
    let http: HttpClient;
    let interceptorInstance: HttpInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LoaderService,
                HttpClient,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true
                }
            ]
        });

        // inject the service
        httpMock = TestBed.inject(HttpTestingController);
        loaderService = TestBed.inject(LoaderService);
        http = TestBed.inject(HttpClient);

        interceptorInstance = getInterceptorInstance<HttpErrorInterceptor>(
            TestBed.inject(HTTP_INTERCEPTORS),
            HttpErrorInterceptor
        );
    });

    it('should test if interceptor instance defined', () => {
        expect(interceptorInstance).toBeDefined();
    });

    it('should return error if body.status is not equal to 200', done => {
        http.get('/getErrorInBody').subscribe(
            data => {},
            err => {
                expect(err).toEqual(
                    new HttpErrorResponse({
                        error: 'Not Found',
                        status: 400,
                        statusText: 'Error',
                        url: '/getErrorInBody'
                    })
                );
                done();
            }
        );

        const req = httpMock.expectOne('/getErrorInBody');
        req.flush({ status: 400, error: 'Not Found' });

        httpMock.verify();
    });

    it('should pass without errors if body.status is equal to 200', done => {
        http.get('/getCorrectData').subscribe(data => {
            expect(data).toEqual({
                status: 200,
                error: {
                    name: 'Test name',
                    surname: 'Test surname'
                }
            });
            done();
        });

        const req = httpMock.expectOne('/getCorrectData');
        req.flush({
            status: 200,
            error: {
                name: 'Test name',
                surname: 'Test surname'
            }
        });

        httpMock.verify();
    });
});
