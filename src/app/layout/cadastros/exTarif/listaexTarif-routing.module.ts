import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaExTarifComponent } from './listaexTarif.component';

const routes: Routes = [
    {
        path: '', component: ListaExTarifComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaExTarifRoutingModule {
}
