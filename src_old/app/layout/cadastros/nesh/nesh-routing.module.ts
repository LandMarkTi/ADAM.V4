import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeshComponent } from './nesh.component';

const routes: Routes = [
    {
        path: '', component: NeshComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NeshRoutingModule {
}
