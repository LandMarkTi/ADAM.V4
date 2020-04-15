import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ValidaCodigoNovaSenhaComponent } from './validacodigonovasenha.component';
import { ValidaCodigoNovaSenhaModule } from './validacodigonovasenha.module';

describe('ValidaCodigoNovaSenhaComponent', () => {
  let component: ValidaCodigoNovaSenhaComponent;
  let fixture: ComponentFixture<ValidaCodigoNovaSenhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ValidaCodigoNovaSenhaModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaCodigoNovaSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
