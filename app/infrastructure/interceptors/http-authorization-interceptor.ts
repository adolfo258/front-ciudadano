import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthCookieService } from 'kolektor-services';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {
    private userIsLogged = false;
    private accessToken: string;
    private isStatusError = false;
    private refreshToken: string;

    constructor(private authCookieService: AuthCookieService, private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.getUserData();

        if (this.hasToIntercept(request.url)) {
            request = this.addAuthenticationToken(request);
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return this.handleExpiredToken(request, next);
                } else if (error.status === 403) {
                    return this.handleForbbiden(request, next);
                } else {
                    const valorInvalid = new RegExp('^(Invalid refresh.token).+');
                    if (error.status === 400 && valorInvalid.test(error.error.error_description)) {
                        return this.handleExpiredRefreshToken();
                    } else {
                        return throwError(error);
                    }
                }
            })
        );
    }

    /**
     * Method to obtain the necessary user data.
     */
    public getUserData(): void {
        this.authCookieService.loadUserFromCookie(environment.settings.cookieName);
        this.userIsLogged = this.authCookieService.isLogged();
        this.accessToken = this.userIsLogged ? this.authCookieService.getUserInfo().accessToken : '';
        this.refreshToken = this.userIsLogged ? this.authCookieService.getUserInfo().refreshToken : '';
    }

    /**
     * Method to determine if the request should be handled
     * @param url endpoint url to call
     */
    private hasToIntercept(url: string): boolean {
        const isInformDeuda = url.indexOf('WSRestTramites/secured/informeDeuda') > -1;
        const isPeInvoker = url.indexOf('WSRestDeudaFront/rest/solicitudPeInvoker') > -1;
        //  TODO: Revisar cuando interceptar el servicio de deuda por sujeto
        const isRefreshTokenRequest = url.indexOf('oauth-server/oauth/token') > -1;
        const isServiceRequest = this.isServiceRequest(url);
        const hasToInterceptUrl = !isRefreshTokenRequest && isServiceRequest && !isInformDeuda && !isPeInvoker;
        return this.userIsLogged && hasToInterceptUrl;
    }

    /**
     * Method to validate if the url belongs to a webservice
     */
    private isServiceRequest(url): boolean {
        const regexp = new RegExp(environment.settings.servicesSubdomain, 'gi');
        return regexp.test(url);
    }

    /**
     * Method to set access token in header
     */
    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.accessToken}`
            }
        });
    }

    /**
     * Method to handle expired token
     */
    private handleExpiredToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isStatusError) {
            this.isStatusError = true;
            return this.authService.refreshAccessToken(this.authCookieService.getUserInfo().cuit).pipe(
                map((response: any) => {
                    this.authCookieService.updateNewAccessToken(response.access_token, response.refresh_token);
                    this.refreshToken = response.refresh_token;
                    this.accessToken = response.access_token;
                    window.location.href = '/emisiontributaria/perfil/impuestos';
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 400 || error.status === 401) {
                        this.authCookieService.deleteCookie();
                    } else {
                        return throwError(error);
                    }
                })
            );
        }
        return throwError('error');
    }

    /**
     * Method to handle expired token
     */
    private handleExpiredRefreshToken() {
        window.location.href = environment.settings.headerData.loginStatusOptions.linkLogOut;
        return throwError('Error-invalid-refresh-token');
    }

    private handleForbbiden(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request);
    }
}
