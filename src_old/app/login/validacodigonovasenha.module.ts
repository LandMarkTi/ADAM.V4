import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { ValidaCodigoNovaSenhaRoutingModule } from './validacodigonovasenha-routing.module';
import { ValidaCodigoNovaSenhaComponent } from './validacodigonovasenha.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ValidaCodigoNovaSenhaRoutingModule,
        DxButtonModule,
        DxDataGridModule,
        DxTextBoxModule,
        DxValidatorModule,
        DxPopupModule,
        DxDropDownBoxModule,
        DxSelectBoxModule,
        DxNumberBoxModule,
        DxListModule,
        DxTextAreaModule,
        DxLoadPanelModule],
    declarations: [ValidaCodigoNovaSenhaComponent]
})
export class ValidaCodigoNovaSenhaModule {}
