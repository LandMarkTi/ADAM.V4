import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidaCodigoNovaSenhaComponent } from './validacodigonovasenha.component';

const routes: Routes = [
    {
        path: '',
        component: ValidaCodigoNovaSenhaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidaCodigoNovaSenhaRoutingModule {}
