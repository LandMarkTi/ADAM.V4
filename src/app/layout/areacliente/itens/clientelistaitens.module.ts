import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule, DxTextBoxModule } from 'devextreme-angular';
import { ClienteListaItensRoutingModule } from './clientelistaitens-routing.module';
import { ClienteListaItensComponent } from './clientelistaitens.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ClienteListaItensRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule, DxTextBoxModule],
    declarations: [ClienteListaItensComponent]
})
export class ClienteListaItensModule {}
