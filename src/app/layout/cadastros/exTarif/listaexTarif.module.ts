import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { ListaExTarifRoutingModule } from './listaexTarif-routing.module';
import { ListaExTarifComponent } from './listaexTarif.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ListaExTarifRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ListaExTarifComponent]
})
export class ListaExTarifModule {}
