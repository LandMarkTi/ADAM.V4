import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { NcmService } from '../../../shared/services/ncm.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Ncm, NcmToDb } from 'src/app/shared/models/ncm.model';
import { identifierModuleUrl } from '@angular/compiler';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-ncm',
    templateUrl: './ncm.component.html',
    styleUrls: ['./ncm.component.scss'],
    animations: [routerTransition()],
    providers: [NcmService]
})
export class NcmComponent implements OnInit {

    constructor(private ncmService: NcmService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    
    @Input() idNCM: number;
    ncm: Ncm;
    isClienteVisible = false;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idNCM = params['idNCM'];
        },
        error => {
            this.errorHandler(error);
        });

        this.carregaNCM();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    carregaNCM(): void {
        this.isLoadPanelVisible = true;
        if (this.idNCM !== undefined) {
            this.ncmService.getNcm(this.idNCM).subscribe((res: Ncm) => {
                this.ncm = res;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.ncm = new Ncm();
            this.isLoadPanelVisible = false;
        }
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        this.router.navigate(['listancm']);
    }

    onFormSubmit = function(e) {

        const ncmToDbToDb: NcmToDb = new NcmToDb();

        if (this.ncm.idNCM != null && this.ncm.idNCM !== undefined) {
            ncmToDbToDb.IdNCM = this.ncm.idNCM;
        }

        ncmToDbToDb.CdNCM = this.ncm.cdNCM;
        ncmToDbToDb.DsNCM = this.ncm.dsNCM;
        ncmToDbToDb.DsHNCM = this.ncm.dsHNCM;
        ncmToDbToDb.FlAtivo = true;
        ncmToDbToDb.DtCriacao = new Date();

        let inputIdNCM = '';

        if (this.idNCM !== undefined) {
            inputIdNCM = this.idNCM.toString();
        }
        this.isLoadPanelVisible = true;
        this.ncmService.verificarCodigoInexistente(inputIdNCM, this.ncm.cdNCM)
        .subscribe(retornoNome => {
            if (!retornoNome) {
              this.isLoadPanelVisible = false;
              this.msgErroValidacao = 'Código já utilizado.';
              this.isPopupErroVisible = true;
              return false;
            } else {
                this.ncmService.saveNcm(ncmToDbToDb).subscribe(retoroSalvar => {
                    this.isLoadPanelVisible = false;
                    this.isPopupVisible = true;
              });
            }
        },
        error => {
            this.errorHandler(error);
        });
        e.preventDefault();
    };

    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    popup_hidden(e): void {
        this.router.navigate(['listancm']);
    }

    passwordsIguais(e): boolean {

        return false;
    }

    clienteObrigatorio(e): boolean {
        const retorno: boolean = e.validator._isHidden !== false;
        return retorno;
    }
}

