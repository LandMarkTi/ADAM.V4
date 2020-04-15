import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { NcmRoutingModule } from './ncm-routing.module';
import { NcmComponent } from './ncm.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, NcmRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxLoadPanelModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule],
    declarations: [NcmComponent]
})
export class NcmModule {}
