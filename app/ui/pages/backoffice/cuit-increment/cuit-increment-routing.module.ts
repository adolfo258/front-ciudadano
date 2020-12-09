import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuitIncrementComponent } from './cuit-increment.component';

const routes: Routes = [
    {
        path: 'incremento',
        component: CuitIncrementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CuitIncrementRoutingModule {}
