import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Interceptors
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { LoaderInterceptor } from './interceptors/loader-interceptor';
import { HttpAuthorizationInterceptor } from './interceptors/http-authorization-interceptor';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './interceptors/timeout-interceptor.interceptor';

// Services
import { GlobalErrorHandler } from './services/global-error-handler.service';

// Kolektor Services
import { ConfigurationService } from 'kolektor-services';

// External services
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [
        ConfigurationService,
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthorizationInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
        { provide: DEFAULT_TIMEOUT, useValue: 60000 },
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
    ]
})
export class InfrastructureModule {}
