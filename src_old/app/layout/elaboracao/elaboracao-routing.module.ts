import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElaboracaoComponent } from './elaboracao.component';

const routes: Routes = [
    {
        path: '', component: ElaboracaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ElaboracaoRoutingModule {
}
