import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Try to import only the directives that you is going to use.
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';

// Kolektor components library.
import { KolektorUiComponentsModule } from 'kolektor-ui-components';

// Modules
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        NgbModule,
        BrowserModule,
        AppRoutingModule,
        KolektorUiComponentsModule,
        HttpClientModule,
        InfrastructureModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class UiModule {}
