import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteListaItensComponent } from './clientelistaitens.component';

const routes: Routes = [
    {
        path: '', component: ClienteListaItensComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteListaItensRoutingModule {
}
