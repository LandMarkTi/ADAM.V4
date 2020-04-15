import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NveComponent } from './nve.component';

const routes: Routes = [
    {
        path: '', component: NveComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NveRoutingModule {
}
