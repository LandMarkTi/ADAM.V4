import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { AlteraSenhaRoutingModule } from './alterasenha-routing.module';
import { AlteraSenhaComponent } from './alterasenha.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        AlteraSenhaRoutingModule,
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
    declarations: [AlteraSenhaComponent]
})
export class AlteraSenhaModule {}
