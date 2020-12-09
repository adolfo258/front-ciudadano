import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedRoutingModule } from './shared-routing.module';
import { FormsModule } from '@angular/forms';

// Components
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
    declarations: [ErrorPageComponent],
    imports: [CommonModule, NgbTooltipModule, NgbDropdownModule, NgbModalModule, SharedRoutingModule, FormsModule],
    exports: [ErrorPageComponent],
    entryComponents: []
})
export class SharedModule {}
