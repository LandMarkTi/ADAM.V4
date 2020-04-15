import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule, DxTextBoxModule } from 'devextreme-angular';
import { ListaItensRoutingModule } from './listaitens-routing.module';
import { ListaItensComponent } from './listaitens.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [CommonModule, ListaItensRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule, DxTextBoxModule],
    declarations: [ListaItensComponent]
})
export class ListaItensModule {}
