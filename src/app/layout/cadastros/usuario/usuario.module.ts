import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxLoadPanelModule } from 'devextreme-angular';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import { PageHeaderModule } from '../../../shared';
import { FormsModule } from '@angular/forms';  // Adicionei aqui

@NgModule({
    imports: [CommonModule, UsuarioRoutingModule, PageHeaderModule, DxButtonModule, DxPopupModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule, DxDropDownBoxModule, DxSelectBoxModule, DxLoadPanelModule],
    declarations: [UsuarioComponent]
})
export class UsuarioModule {}
