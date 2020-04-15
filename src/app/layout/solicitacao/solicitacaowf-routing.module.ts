import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitacaoComponent } from './solicitacaowf.component';

const routes: Routes = [
    {
        path: '', component: SolicitacaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SolicitacaoWFRoutingModule {
}
