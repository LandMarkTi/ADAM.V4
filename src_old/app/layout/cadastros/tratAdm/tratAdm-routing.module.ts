import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TratAdmComponent } from './tratAdm.component';

const routes: Routes = [
    {
        path: '', component: TratAdmComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TratAdmRoutingModule {
}
