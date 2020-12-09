import { Settings } from 'src/app/entities/settings-configuration.interface';

export const environment: {
    production: boolean;
    settings: Settings;
} = {
    production: true,
    settings: {}
};
