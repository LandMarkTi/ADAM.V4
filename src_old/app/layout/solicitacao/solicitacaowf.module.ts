import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextAreaModule, DxDateBoxModule, DxTextBoxModule, DxValidatorModule, DxCheckBoxModule, DxPopupModule, DxDropDownBoxModule, DxRadioGroupModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxLoadPanelModule } from 'devextreme-angular';
import { SolicitacaoWFRoutingModule } from './solicitacaowf-routing.module';
import { SolicitacaoComponent } from './solicitacaowf.component';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';  // Adicionei aqui

@NgModule({
    imports: [CommonModule, DxCheckBoxModule, SolicitacaoWFRoutingModule, DxTextAreaModule, DxDateBoxModule, DxRadioGroupModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxLoadPanelModule],
    declarations: [SolicitacaoComponent]
})
export class SolicitacaoWFModule {}
