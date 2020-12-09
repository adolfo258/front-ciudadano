import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuitIncrementRoutingModule } from './cuit-increment-routing.module';
import { CuitIncrementComponent } from './cuit-increment.component';


@NgModule({
  declarations: [CuitIncrementComponent],
  imports: [
    CommonModule,
    CuitIncrementRoutingModule
  ]
})
export class CuitIncrementModule { }
