import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaNveComponent } from './listanve.component';

const routes: Routes = [
    {
        path: '', component: ListaNveComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaNveRoutingModule {
}
