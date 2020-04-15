import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaTratAdmComponent } from './listatratAdm.component';

const routes: Routes = [
    {
        path: '', component: ListaTratAdmComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaTratAdmRoutingModule {
}
