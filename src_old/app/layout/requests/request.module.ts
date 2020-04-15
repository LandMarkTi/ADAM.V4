import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxLoadPanelModule } from 'devextreme-angular';
import { RequestRoutingModule } from './request-routing.module';
import { RequestComponent } from './request.component';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';  // Adicionei aqui

@NgModule({
    imports: [CommonModule, RequestRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxLoadPanelModule],
    declarations: [RequestComponent]
})
export class RequestModule {}
