import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NcmComponent } from './ncm.component';

const routes: Routes = [
    {
        path: '', component: NcmComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NcmRoutingModule {
}
