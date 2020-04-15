import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisaoGerencialComponent } from './visaogerencial.component';

const routes: Routes = [
    {
        path: '', component: VisaoGerencialComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisaoGerencialRoutingModule {
}
