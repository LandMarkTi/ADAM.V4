import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaNeshComponent } from './listanesh.component';

const routes: Routes = [
    {
        path: '', component: ListaNeshComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaNeshRoutingModule {
}
