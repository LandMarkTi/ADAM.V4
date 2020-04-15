import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteListaRequestsComponent } from './clientelistarequests.component';

const routes: Routes = [
    {
        path: '', component: ClienteListaRequestsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteListaRequestsRoutingModule {
}
