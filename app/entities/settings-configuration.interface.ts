import { HeaderData } from './header-data.interface';

export interface Settings {
    environment?: string;
    webSubdomain?: string;
    servicesSubdomain?: string;
    cookieName?: string;
    baseWebUrl?: string;
    baseServicesUrl?: string;
    headerData?: HeaderData;
    miRentasUrl?: string;
    authCaptcha?: string;
    basicAuthToken?: string;
}
