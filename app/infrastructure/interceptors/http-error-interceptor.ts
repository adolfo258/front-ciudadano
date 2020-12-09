import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    /**
     * Method to determine if the request should be intercepted
     * @param event endpoint url to call
     */
    private hasToIntercept(event): boolean {
        const allowedStates = [200, '200', '0', '200 OK', '2', '1', 99, '99'];
        let hasToIntercept = false;
        if (event.body.status !== undefined) {
            hasToIntercept = !allowedStates.includes(event.body.status);
        }
        return hasToIntercept;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (this.hasToIntercept(event)) {
                        throw new HttpErrorResponse({
                            error: event.body.name || event.body.error || event.body,
                            headers: event.headers,
                            status: event.body.status || 400,
                            statusText: 'Error',
                            url: event.url
                        });
                    } else {
                        return event;
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                throw error;
            })
        );
    }
}
