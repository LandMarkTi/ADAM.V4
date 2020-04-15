import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteListaPendenciasComponent } from './clientelistapendencias.component';

const routes: Routes = [
    {
        path: '', component: ClienteListaPendenciasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteListaPendenciasRoutingModule {
}
