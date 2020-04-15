import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxLoadPanelModule } from 'devextreme-angular';
import { NeshRoutingModule } from './nesh-routing.module';
import { NeshComponent } from './nesh.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, NeshRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxLoadPanelModule],
    declarations: [NeshComponent]
})
export class NeshModule {}
