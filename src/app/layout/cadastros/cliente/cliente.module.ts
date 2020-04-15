import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { PageHeaderModule } from '../../../shared';
import { FormsModule } from '@angular/forms';  // Adicionei aqui

@NgModule({
    imports: [CommonModule, ClienteRoutingModule, PageHeaderModule,
        DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule,
        DxValidatorModule, DxTextAreaModule, DxLoadPanelModule],
    declarations: [ClienteComponent]
})
export class ClienteModule {}
