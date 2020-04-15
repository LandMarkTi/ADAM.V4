import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule} from 'devextreme-angular';
import { ListaNveRoutingModule } from './listanve-routing.module';
import { ListaNveComponent } from './listanve.component';
import { PageHeaderModule } from '../../../shared';

@NgModule({
    imports: [CommonModule, ListaNveRoutingModule,  DxPopupModule, PageHeaderModule, DxButtonModule, DxDataGridModule, DxLoadPanelModule],
    declarations: [ListaNveComponent]
})
export class ListaNveModule {}
