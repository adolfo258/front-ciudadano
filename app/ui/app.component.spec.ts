import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { KolektorUiComponentsModule } from 'kolektor-ui-components';

import { ConfigurationService } from 'kolektor-services';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '@infrastructure/services/loader.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Simulate async response for configuration service
export function fakeAsyncResponse<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

const settingsMock = {
    environment: 'local',
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
            linkMiPerfil: 'https://www.rentascordoba.gob.ar/nuevorentas/situacion-fiscal',
            linkCorredor: 'https://preprod.rentascordoba.gob.ar/mirentas/rentas.html?page=tramite_corredores',
            linkMartillero: 'https://preprod.rentascordoba.gob.ar/mirentas/rentas.html?page=procurador_martillero',
            linkProcurador: 'https://preprod.rentascordoba.gob.ar/mirentas/rentas.html?page=procurador_martillero',
            linkMisRepresentados: 'https://www.rentascordoba.gob.ar/nuevorentas/mis-representados',
            linkLogOut: 'https://www.rentascordoba.gob.ar/mirentas/rentas.html',
            linkCidiLogin: 'https://cidi.cba.gov.ar/Cuenta/Login',
            linkCidiSignIn: 'https://cidi.cba.gov.ar/Cuenta/Registracion',
            linkAfipLogin: 'https://auth.afip.gob.ar/contribuyente_/login.xhtml?action=SYSTEM&system=afip-gobcba',
            linkAfipSingIn: 'http://www.afip.gob.ar/claveFiscal/informacion-basica/solicitud.asp'
        }
    }
};

// Mock for service that returns configurations
const configurationServiceMock = {
    getConfigByEnviroment() {
        return fakeAsyncResponse({
            production: false,
            settings: settingsMock
        });
    }
};

export const environmentMock = {
    settings: {
        from: 'environmentMock'
    }
};

// File with translations
const TRANSLATIONS_ES = require('../../assets/i18n/es.json');

describe('AppComponent', () => {
    let appComponent: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let http: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                KolektorUiComponentsModule,
                NgbModule
            ],
            providers: [
                { provide: ConfigurationService, useValue: configurationServiceMock },
                { provide: environment, useClass: environmentMock },
                CookieService,
                LoaderService
            ],
            declarations: [AppComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        http = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(AppComponent);
        appComponent = fixture.debugElement.componentInstance;
    });

    xit('should environment settings do not change before load configuration', () => {
        expect(environment.settings).toEqual({});
    });

    xit('should create the appComponent', () => {
        fixture.detectChanges();
        expect(appComponent).toBeTruthy();
    });

    xit('is loading should be false', async () => {
        appComponent.ngOnInit();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(appComponent.isLoading).toBeFalsy();
    });

    xit('should overwrite environment settings after load config', async () => {
        appComponent.ngOnInit();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(environment.settings).toEqual(settingsMock);
    });

    xit(`should have as title 'kolektor-base-app'`, async () => {
        fixture.detectChanges();
        expect(appComponent.title).toEqual('kolektor-base-app');
    });

    xit('should display "LOADING" while isLoading is true', async () => {
        appComponent.ngOnInit();
        await fixture.whenStable();
        appComponent.isLoading = true;
        fixture.detectChanges();
        const loaderText = fixture.debugElement.nativeElement.querySelector('main h1').textContent;
        expect(loaderText).toEqual('LOADING');
    });

    xit('should display title after load configuration and translations', async () => {
        appComponent.ngOnInit();
        await fixture.whenStable();
        fixture.detectChanges();

        http.expectOne('/baseapp/assets/i18n/es.json').flush(TRANSLATIONS_ES);
        // Finally, assert that there are no outstanding requests.
        http.verify();

        fixture.detectChanges();
        const titleText = fixture.debugElement.nativeElement.querySelector('main h1').textContent;
        expect(titleText).toEqual('Welcome to App kolektor-base-app!');
    });

    xit('should have the correct environment for "Medios y lugares de pago" link in footer', async () => {
        appComponent.ngOnInit();
        await fixture.whenStable();
        fixture.detectChanges();
        const href = fixture.debugElement.nativeElement.querySelectorAll('footer li a')[1].getAttribute('href');
        expect(href).toMatch(/preprod/);
    });
});
