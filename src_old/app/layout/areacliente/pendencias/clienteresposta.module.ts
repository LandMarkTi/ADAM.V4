import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { ClienteRespostaRoutingModule } from './clienteresposta-routing.module';
import { ClienteRespostaComponent } from './clienteresposta.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ClienteRespostaRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule],
    declarations: [ClienteRespostaComponent]
})
export class ClienteRespostaModule {}
