import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { TransferenciasComponent } from './transferencias/transferencias.component';
import { PagosComponent } from './pagos/pagos.component';
import { UltimosMovimientosComponent } from './ultimos-movimientos/ultimos-movimientos.component';


@NgModule({
  declarations: [InicioComponent, TransferenciasComponent, PagosComponent, UltimosMovimientosComponent],
  imports: [
    CommonModule,
    MovimientosRoutingModule
  ]
})
export class MovimientosModule { }
