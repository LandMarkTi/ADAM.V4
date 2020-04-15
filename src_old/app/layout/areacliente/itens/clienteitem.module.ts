import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { ClienteItemRoutingModule } from './clienteitem-routing.module';
import { ClienteItemComponent } from './clienteitem.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ClienteItemRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule],
    declarations: [ClienteItemComponent]
})
export class ClienteItemModule {}
