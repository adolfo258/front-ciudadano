import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthCookieService } from 'kolektor-services';
import { CookieService } from 'ngx-cookie-service';

describe('AuthService', () => {
    let http: HttpClient;
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

    const mockAuthCookieService = {
        getUserInfo: jest.fn(() => UserLoggedMock),
        isLogged: jest.fn(() => true),
        loadUserFromCookie: jest.fn(),
        updateNewAccessToken: jest.fn(),
        deleteCookie: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpClient,
                CookieService,
                {
                    provide: AuthCookieService,
                    useValue: mockAuthCookieService
                }
            ]
        });

        // inject the service
        http = TestBed.inject(HttpClient);
        authCookieService = TestBed.inject(AuthCookieService);
    });

    it('should be created', () => {
        const service: AuthService = TestBed.inject(AuthService);
        expect(service).toBeTruthy();
    });
});
