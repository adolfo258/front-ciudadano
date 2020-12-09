import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

// klk libraries
import { ConfigurationService, AuthCookieService } from 'kolektor-services';

// interfaces
import { HeaderData } from '../entities/header-data.interface';
import { User } from 'kolektor-ui-components/lib/interfaces/user.interface';
import { UserData } from '@entities/user.interface';

// services
import { LoaderService } from '@infrastructure/services/loader.service';
import { ConfigLoadedService } from '@infrastructure/services/config-loaded.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // Global data
    public title = 'kolektor-base-app';
    public isLoading = false;
    public subdomainForFooter: string;
    private configLoaded = false;

    // Header data
    headerData: HeaderData = {
        linkLogoRentas: '',
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
    };
    isLogged = false;
    userDataForHeader: User;
    appSubdomain: string;

    constructor(
        private configService: ConfigurationService,
        private authCookieService: AuthCookieService,
        public loaderService: LoaderService,
        public configLoadedService: ConfigLoadedService,
    ) {

        this.loaderService.isLoading.subscribe(res => {
            this.isLoading = res;
        });

        // Load configuration after get all configuration environment
        this.configLoadedService.isFinish().subscribe(configLoaded => {
            this.configLoaded = configLoaded;
            if (this.configLoaded) {
                this.appSubdomain = environment.settings.webSubdomain;
                this.headerData = environment.settings.headerData;
                this.handleUserData();
            }
        });
    }

    ngOnInit() {
        this.configService.getConfigByEnviroment('assets/configurations/').subscribe((data: any) => {
            environment.settings = data.settings;
            environment.production = false;
            this.configLoadedService.finalize();
        });
    }

    /**
     * Method to handle all user data
     */
    private handleUserData(): void {
        this.authCookieService.loadUserFromCookie(environment.settings.cookieName);
        const user = this.authCookieService.getUserInfo();
        this.isLogged = this.authCookieService.isLogged();
        if (this.isLogged) {
            this.setUserDataToHeader(user);
            this.configTypeUser(user);
        }
    }

    /**
     * Method to format the user data necessary for the header.
     * @param user - User data.
     */
    private setUserDataToHeader(user: UserData): void {
        this.userDataForHeader = {
            cuit: user.cuit.toString().replace(/[+]/g, ''),
            name: this.formatNameInCookie(user.nombre),
            isCorredor: false,
            isMartillero: false,
            isProcurador: false,
            hasRepresantos: false,
            hasFiscalizaciones: false
        };
    }

    /**
     * @description set cookie user info from cookie data
     * @param userInfoCookie User info from cookie rentas
     */
    configTypeUser(userInfoCookie: any) {
        this.userDataForHeader.hasRepresantos =
            userInfoCookie.representantes && userInfoCookie.representantes.length > 1;
        this.userDataForHeader.isCorredor = userInfoCookie.corredor === 1;
        this.userDataForHeader.isProcurador = userInfoCookie.procurador === 1;
        this.userDataForHeader.isMartillero = userInfoCookie.martillero === 1;
        this.userDataForHeader.hasFiscalizaciones = userInfoCookie.fiscalizaciones ? true : false;
    }

    /**
     * Method to remove the plus symbol in the user's name
     * @param name - Name of the user obtained in the coockie
     * @returns name without the symbol
     */
    private formatNameInCookie(name: string): string {
        return !name ? '' : name.replace(/[+]/g, ' ');
    }
}
