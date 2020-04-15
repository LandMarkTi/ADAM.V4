import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxDateBoxModule, DxLoadPanelModule } from 'devextreme-angular';
import { TratAdmRoutingModule } from './tratAdm-routing.module';
import { TratAdmComponent } from './tratAdm.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, TratAdmRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxDateBoxModule,DxLoadPanelModule],
    declarations: [TratAdmComponent]
})
export class TratAdmModule {}
