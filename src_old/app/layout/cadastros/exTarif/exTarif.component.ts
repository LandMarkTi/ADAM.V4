import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ExTarifService } from '../../../shared/services/exTarif.service';
import { NcmService } from '../../../shared/services/ncm.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExTarif, ExTarifToDb } from 'src/app/shared/models/exTarif.model';
import { Ncm } from 'src/app/shared/models/ncm.model';
import { identifierModuleUrl } from '@angular/compiler';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-exTarif',
    templateUrl: './exTarif.component.html',
    styleUrls: ['./exTarif.component.scss'],
    animations: [routerTransition()],
    providers: [ExTarifService]
})
export class ExTarifComponent implements OnInit {

    constructor(private autenticacaoService: AutenticacaoService, private ncmService: NcmService, private exTarifService: ExTarifService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    @Input() IdExTarif: number;
    exTarif: ExTarif;
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
            this.IdExTarif = params['idExTarif'];
        },
        error => {
            this.errorHandler(error);
        });

        this.carregaExTarif();

    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    updateNcmInfo(e) {
        if (e.value.length === 8) {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmByCode(e.value).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                this.exTarif.idNCM = res.idNCM;
                this.exTarif.cdNCM = res.cdNCM;
                this.exTarif.dsNCM = res.dsNCM;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.exTarif.idNCM = null;
        }
    }

    carregaExTarif(): void {
        if (this.IdExTarif !== undefined) {
            this.isLoadPanelVisible = true;
            this.exTarifService.getExTarif(this.IdExTarif).subscribe((res: ExTarif) => {
                this.exTarif = res;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.exTarif = new ExTarif();
        }
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        this.router.navigate(['listexTarif']);
    }

    onFormSubmit = function(e) {

        let inputIdExTarif = '';

        if (this.IdExTarif !== undefined) {
            inputIdExTarif = this.IdExTarif.toString();
        }

        if (this.exTarif.cdNCM.length < 8) {
          this.msgErroValidacao = 'Código NCM inválido.';
            this.isPopupErroVisible = true;
            return false;
        } else {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmByCode(this.exTarif.cdNCM).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                if (res === undefined || res === null) {
                    this.msgErroValidacao = 'Código NCM não encontrado.';
                    this.isPopupErroVisible = true;
                    return false;
                } else {
                    this.exTarif.idNCM = res.idNCM;
                    this.exTarif.cdNCM = res.cdNCM;
                    this.exTarif.dsNCM = res.dsNCM;

                    const exTarifToDb: ExTarifToDb = new ExTarifToDb();

                    if (this.exTarif.idExTarif != null && this.exTarif.idExTarif !== undefined) {
                        exTarifToDb.IdExTarif = this.exTarif.idExTarif;
                        exTarifToDb.DtCriacao = this.exTarif.dtCriacao;
                    } else {
                        exTarifToDb.DtCriacao = new Date();
                    }

                    exTarifToDb.IdNCM = this.exTarif.idNCM;
                    exTarifToDb.CdEx = this.exTarif.cdEx;
                    exTarifToDb.DsDescricao = this.exTarif.dsDescricao;
                    exTarifToDb.AliqIIN = this.exTarif.aliqIIN;
                    exTarifToDb.AliqIIV = this.exTarif.aliqIIV;
                    exTarifToDb.AliqIPI = this.exTarif.aliqIPI;
                    exTarifToDb.AliqPis = this.exTarif.aliqPis;
                    exTarifToDb.AliqCofins = this.exTarif.aliqCofins;
                    exTarifToDb.DsICMS = this.exTarif.dsICMS;
                    exTarifToDb.DsST = this.exTarif.dsST;
                    exTarifToDb.DsSSN  = this.exTarif.dsSSN;
                    exTarifToDb.FlAtivo = true;
                    this.isLoadPanelVisible = true;
                    this.exTarifService.saveExTarif(exTarifToDb).subscribe(retoroSalvar => {
                        this.isLoadPanelVisible = false;
                        this.isPopupVisible = true;
                    },
                    error => {
                        this.errorHandler(error);
                    });
                }
            },
            error => {
                this.errorHandler(error);
            });
        }

        e.preventDefault();
    };

    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    popup_hidden(e): void {
        this.router.navigate(['listexTarif']);
    }

    clienteObrigatorio(e): boolean {
        const retorno: boolean = e.validator._isHidden !== false;
        return retorno;
    }
}

