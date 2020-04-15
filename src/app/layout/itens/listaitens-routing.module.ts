import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaItensComponent } from './listaitens.component';

const routes: Routes = [
    {
        path: '', component: ListaItensComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaItensRoutingModule {
}
