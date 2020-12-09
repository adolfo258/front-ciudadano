import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenService {
    constructor(private http: HttpClient) {}

    /**
     *  Method for call OauthServer and refresh token
     */
    public getRefreshedAccessToken(refreshToken: string): Observable<any> {
        const urlOauthServer = `${environment.settings.baseServicesUrl}/oauth-server/oauth/token`;

        const params = new HttpParams({
            fromObject: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }
        });

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic a2xrLWNsaWVudDprbGstc2VjcmV0'
            })
        };

        return this.http.post(urlOauthServer, params, httpOptions);
    }
}
