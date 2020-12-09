import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PagosComponent } from './pagos/pagos.component';
import { TransferenciasComponent } from './transferencias/transferencias.component';
import { UltimosMovimientosComponent } from './ultimos-movimientos/ultimos-movimientos.component';

const routes: Routes = [
    {
        path: 'inicio',
        component: InicioComponent
    },
    {
        path: 'transferencias',
        component: TransferenciasComponent
    },
    {
        path: 'pagos',
        component: PagosComponent
    },
    {
        path: 'ultimos-movimientos',
        component: UltimosMovimientosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MovimientosRoutingModule {}
