import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidatorModule,  DxPopupModule, DxDropDownBoxModule, DxSelectBoxModule, DxNumberBoxModule, DxListModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
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
    declarations: [LoginComponent]
})
export class LoginModule {}
