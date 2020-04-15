import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaSolicitacaoComponent } from './listasolicitacao.component';

const routes: Routes = [
    {
        path: '', component: ListaSolicitacaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaSolicitacaoRoutingModule {
}
