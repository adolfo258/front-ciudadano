import { TestBed } from '@angular/core/testing';
import { RefreshTokenService } from './refresh-token.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

const RefreshTokenMock = {
    access_token: 'f191c5d4-11f2-48b6-b667-97882b37ffae',
    token_type: 'bearer',
    refresh_token: '1cf6cab2-6feb-4c4c-8d79-448352addacf',
    expires_in: 1199,
    scope: 'read write trust'
};

const refreshTokenServiceMock = {
    getRefreshedAccessToken: jest.fn(rt => of(RefreshTokenMock))
};

describe('RefreshTokenService', () => {
    let service: RefreshTokenService;
    let http: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpClient, RefreshTokenService]
        });

        service = TestBed.inject(RefreshTokenService);
        http = TestBed.inject(HttpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be refresh token', () => {
        spyOn(service, 'getRefreshedAccessToken').and.returnValue(of(RefreshTokenMock));
        const result = service.getRefreshedAccessToken('5864fef1-8960-4eff-a7ab-b66971328403');
        expect(result).toBeDefined();
    });
});
