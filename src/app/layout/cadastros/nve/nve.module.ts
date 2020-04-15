import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxLoadPanelModule } from 'devextreme-angular';
import { NveRoutingModule } from './nve-routing.module';
import { NveComponent } from './nve.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, NveRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxLoadPanelModule],
    declarations: [NveComponent]
})
export class NveModule {}
