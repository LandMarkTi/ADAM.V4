import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaRequestsComponent } from './listarequests.component';

const routes: Routes = [
    {
        path: '', component: ListaRequestsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaRequestsRoutingModule {
}
