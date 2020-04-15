import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxLoadPanelModule,DxAutocompleteModule, DxDateBoxModule } from 'devextreme-angular';
import { ExTarifRoutingModule } from './exTarif-routing.module';
import { ExTarifComponent } from './exTarif.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ExTarifRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxLoadPanelModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxDateBoxModule],
    declarations: [ExTarifComponent]
})
export class ExTarifModule {}
