import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaNcmComponent } from './listancm.component';

const routes: Routes = [
    {
        path: '', component: ListaNcmComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaNcmRoutingModule {
}
