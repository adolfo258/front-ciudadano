import { ErrorPageComponent } from './error-page.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { moduleMetadata, storiesOf } from '@storybook/angular';

const stories = storiesOf('ErrorPageComponent', module);

stories.addDecorator(
    moduleMetadata({
        declarations: [ErrorPageComponent],
        imports: [HttpClientModule],
        providers: [HttpClient]
    })
);

stories.add(
    'Error 500',
    () => ({
        component: ErrorPageComponent,
        props: {
            fiscalSituation: {
                hasDebt: true,
                amount: 10000,
                typeMessage: 'S'
            }
        }
    }),
    { notes: 'Tax situation component' }
);

stories.add(
    'Error 404',
    () => ({
        component: ErrorPageComponent,
        props: {
            fiscalSituation: {
                hasDebt: false,
                amount: 0,
                typeMessage: 'A'
            }
        }
    }),
    { notes: 'Tax situation component' }
);

stories.add(
    'Error 504',
    () => ({
        component: ErrorPageComponent,
        props: {
            fiscalSituation: {
                hasDebt: false,
                amount: 0,
                typeMessage: 'A'
            }
        }
    }),
    { notes: 'Tax situation component' }
);
