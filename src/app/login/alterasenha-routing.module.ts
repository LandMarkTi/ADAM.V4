import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlteraSenhaComponent } from './alterasenha.component';

const routes: Routes = [
    {
        path: '',
        component: AlteraSenhaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlteraSenhaRoutingModule {}
