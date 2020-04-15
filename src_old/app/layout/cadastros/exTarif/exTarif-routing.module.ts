import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExTarifComponent } from './exTarif.component';

const routes: Routes = [
    {
        path: '', component: ExTarifComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExTarifRoutingModule {
}
