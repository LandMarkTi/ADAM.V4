import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { ListaRequestsRoutingModule } from './listarequests-routing.module';
import { ListaRequestsComponent } from './listarequests.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [CommonModule, ListaRequestsRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ListaRequestsComponent]
})
export class ListaRequestsModule {}
