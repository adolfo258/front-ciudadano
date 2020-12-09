import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthCookieService } from 'kolektor-services';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private authCookieService: AuthCookieService) {}

    /**
     * Method to call endpoint for refresh acess token
     */
    public refreshAccessToken(cuit: string): Observable<any> {
        const urlOauthServer = `${environment.settings.baseServicesUrl}oauth-server/oauth/token`;

        const refreshToken = this.authCookieService.getUserInfo().refreshToken;
        const httpOptions = {
            headers: new HttpHeaders({ Authorization: `Basic ${environment.settings.basicAuthToken}` })
        };
        const params = new HttpParams({
            fromObject: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }
        });

        return this.http.post(urlOauthServer, params, httpOptions);
    }
}
