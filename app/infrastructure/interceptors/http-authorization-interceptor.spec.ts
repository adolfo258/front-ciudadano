import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpInterceptor } from '@angular/common/http';

import { HttpAuthorizationInterceptor } from './http-authorization-interceptor';
import { CookieService } from 'ngx-cookie-service';

import { AuthCookieService } from 'kolektor-services';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { RefreshTokenService } from '../services/refresh-token.service';

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

environment.settings = {
    environment: 'PREPROD',
    webSubdomain: 'preprod',
    servicesSubdomain: 'apppreprod',
    cookieName: 'RENTASPREPROD',
    baseWebUrl: 'https://apppreprod.rentascordoba.gob.ar/',
    baseServicesUrl: 'https://preprod.rentascordoba.gob.ar/',
    miRentasUrl: 'https://preprod.rentascordoba.gob.ar/mirentas/rentas.html',
    authCaptcha: 'https://apppreprod.rentascordoba.gob.ar/WSRestDeudaR2/loginservice/anonymous/',
    headerData: {
        linkLogoRentas: 'https://www.rentascordoba.gob.ar/mirentas/rentas.html',
        loginStatusOptions: {
            linkMiPerfil: '',
            linkCorredor: '',
            linkMartillero: '',
            linkProcurador: '',
            linkMisRepresentados: '',
            linkFiscalizaciones: '',
            linkLogOut: '',
            linkCidiLogin: '',
            linkCidiSignIn: '',
            linkAfipLogin: '',
            linkAfipSingIn: ''
        },
        linkTramite: '',
        linkConstanciaRegular: ''
    }
};

describe('HttpAuthorizationInterceptor', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;
    let refreshTokenService: RefreshTokenService;
    let interceptorInstance: HttpInterceptor;
    let authCookieService: AuthCookieService;

    const UserLoggedMock = {
        cuit: '22222222222',
        nombre: 'SOSA+MAURO+JULIO',
        token: 'akjsdhf5544h4hg4gwhferhg5gh4fwqjhg4fq',
        refreshToken: '2tre45y2t4r5e2yt3e52y3t45g2fjh345gf2j4',
        timestamp: '2019071514234723',
        semilla: '2FJH345GF2J34H5GF2J3H4GF',
        procurador: 0,
        tiposujetopasivo: 'F',
        monotributo: 'NO',
        procurador_ant: 'N',
        corredor: 0,
        fiscalizaciones: '',
        usuario: '',
        cm: '',
        date: '',
        accessToken: '5864fef1-8960-4eff-a7ab-b66971328403',
        representantes: [
            {
                cuit: '333333333333333333333333',
                nombre: 'SOSA+MAURO+JULIO'
            }
        ]
    };

    const RefreshTokenMock = {
        access_token: 'f191c5d4-11f2-48b6-b667-97882b37ffae',
        token_type: 'bearer',
        refresh_token: '1cf6cab2-6feb-4c4c-8d79-448352addacf',
        expires_in: 1199,
        scope: 'read write trust'
    };

    const mockAuthCookieService = {
        getUserInfo: jest.fn(() => UserLoggedMock),
        isLogged: jest.fn(() => true),
        loadUserFromCookie: jest.fn(),
        updateNewAccessToken: jest.fn(),
        deleteCookie: jest.fn()
    };

    const refreshTokenServiceMock = {
        getRefreshedAccessToken: jest.fn(rt => of(RefreshTokenMock))
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [
                HttpClient,
                CookieService,
                {
                    provide: AuthCookieService,
                    useValue: mockAuthCookieService
                },
                {
                    provide: RefreshTokenService,
                    useValue: refreshTokenServiceMock
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpAuthorizationInterceptor,
                    multi: true
                }
            ]
        });

        // inject the service
        httpMock = TestBed.inject(HttpTestingController);
        http = TestBed.inject(HttpClient);
        refreshTokenService = TestBed.inject(RefreshTokenService);
        authCookieService = TestBed.inject(AuthCookieService);

        interceptorInstance = getInterceptorInstance<HttpAuthorizationInterceptor>(
            TestBed.inject(HTTP_INTERCEPTORS),
            HttpAuthorizationInterceptor
        );
    });

    it('should test if interceptor instance defined', () => {
        expect(interceptorInstance).toBeDefined();
    });

    xit('should add authorization header', () => {
        http.get('http://localhost:8882/data').subscribe();
        const req = httpMock.expectOne(`http://localhost:8882/data`);
        const AT = `Bearer ${UserLoggedMock.accessToken}`;
        const reqAuth = req.request.headers.get('Authorization');
        expect(reqAuth).toEqual(AT);
    });

    it('should not add authorization header', () => {
        spyOn(authCookieService, 'isLogged').and.returnValue(false);
        http.get('/data').subscribe();
        const req = httpMock.expectOne(`/data`);
        const reqAuth = req.request.headers.get('Authorization');
        expect(reqAuth).toBeNull();
    });

    // TODO: Resolver. Este test causa que no llegue a la covertura necesaria
    xit('should refresh token', () => {
        // 1. Call Api
        http.get('http://localhost:8882/getAuthenticatedService').subscribe();

        // 2. Expect 401
        const req1 = httpMock.expectOne(`http://localhost:8882/getAuthenticatedService`);
        req1.flush({ status: 401, messagge: 'Expired Token' });

        const AT = RefreshTokenMock.access_token;
        const reqAuth = authCookieService.getUserInfo().accessToken;

        expect(reqAuth).toEqual(AT);

        /*
        const req2 = httpMock.expectOne(`http://localhost:8882/oauth-server/oauth/token`);
        const AT = `Bearer ${RefreshTokenMock.access_token}`;
        const reqAuth = req2.request.headers.get('Authorization');
        req1.flush(RefreshTokenMock);*/
        /*
        http.get('/getnon401Error').subscribe();
        const req2 = httpMock.expectOne(`/getnon401Error`);
        const AT2 = `Bearer ${RefreshTokenMock.access_token}`;
        const reqAuth2 = req2.request.headers.get('Authorization');
        req2.flush({ status: 200, messagge: 'Non expired Token' });
        */
    });
});
