import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaClientesComponent } from './listaclientes.component';

const routes: Routes = [
    {
        path: '', component: ListaClientesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaClientesRoutingModule {
}
