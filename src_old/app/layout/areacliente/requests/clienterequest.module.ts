import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxLoadPanelModule } from 'devextreme-angular';
import { ClienteRequestRoutingModule } from './clienterequest-routing.module';
import { ClienteRequestComponent } from './clienterequest.component';
import { PageHeaderModule } from '../../../shared';
import { FormsModule } from '@angular/forms';  // Adicionei aqui

@NgModule({
    imports: [CommonModule, ClienteRequestRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxLoadPanelModule],
    declarations: [ClienteRequestComponent]
})
export class ClienteRequestModule {}
