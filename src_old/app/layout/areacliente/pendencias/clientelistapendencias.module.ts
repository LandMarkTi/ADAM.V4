import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { ClienteListaPendenciasRoutingModule } from './clientelistapendencias-routing.module';
import { ClienteListaPendenciasComponent } from './clientelistapendencias.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ClienteListaPendenciasRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ClienteListaPendenciasComponent]
})
export class ClienteListaPendenciasModule {}
