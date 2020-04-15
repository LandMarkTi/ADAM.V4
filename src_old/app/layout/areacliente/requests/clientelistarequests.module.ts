import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { ClienteListaRequestsRoutingModule } from './clientelistarequests-routing.module';
import { ClienteListaRequestsComponent } from './clientelistarequests.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ClienteListaRequestsRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ClienteListaRequestsComponent]
})
export class ClienteListaRequestsModule {}
