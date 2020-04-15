import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxSelectBoxModule, DxCheckBoxModule, DxLoadPanelModule } from 'devextreme-angular';
import { VisaoGerencialRoutingModule } from './visaogerencial-routing.module';
import { VisaoGerencialComponent } from './visaogerencial.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [CommonModule, VisaoGerencialRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxLoadPanelModule],
    declarations: [VisaoGerencialComponent]
})
export class VisaoGerencialModule {}
