import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxValidationSummaryModule, DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { ElaboracaoRoutingModule } from './elaboracao-routing.module';
import { ElaboracaoComponent } from './elaboracao.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [DxValidationSummaryModule, CommonModule, ElaboracaoRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule],
    declarations: [ElaboracaoComponent]
})
export class ElaboracaoModule {}
