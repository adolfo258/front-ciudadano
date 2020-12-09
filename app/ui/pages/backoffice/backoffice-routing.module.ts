import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';

const routes: Routes = [
    {
        path: '',
        component: BackofficeComponent,
        loadChildren: () => import('./cuit-increment/cuit-increment.module').then(m => m.CuitIncrementModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackofficeRoutingModule {}
