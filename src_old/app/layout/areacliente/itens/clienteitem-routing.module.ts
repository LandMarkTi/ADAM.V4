import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteItemComponent } from './clienteitem.component';

const routes: Routes = [
    {
        path: '', component: ClienteItemComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteItemRoutingModule {
}
