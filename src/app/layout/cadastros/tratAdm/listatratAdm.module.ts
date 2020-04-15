import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { ListaTratAdmRoutingModule } from './listatratAdm-routing.module';
import { ListaTratAdmComponent } from './listatratAdm.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ListaTratAdmRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ListaTratAdmComponent]
})
export class ListaTratAdmModule {}
