import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { ListaSolicitacaoRoutingModule } from './listasolicitacao-routing.module';
import { ListaSolicitacaoComponent } from './listasolicitacao.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [CommonModule, ListaSolicitacaoRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ListaSolicitacaoComponent]
})
export class ListaSolicitacaoModule {}
