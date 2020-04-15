import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { NveService } from '../../../shared/services/nve.service';
import { NcmService } from '../../../shared/services/ncm.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Nve, NveToDb } from 'src/app/shared/models/nve.model';
import { Ncm } from 'src/app/shared/models/ncm.model';
import { identifierModuleUrl } from '@angular/compiler';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-nve',
    templateUrl: './nve.component.html',
    styleUrls: ['./nve.component.scss'],
    animations: [routerTransition()],
    providers: [NveService]
})
export class NveComponent implements OnInit {

    constructor(private ncmService: NcmService, private nveService: NveService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    @Input() idNVE: number;
    nve: Nve;
    isClienteVisible = false;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    isLoadPanelVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    isInternalUser: boolean;
    idUsuario: number;

    ngOnInit() {



        this.activatedRoute.queryParams.subscribe(params => {
            this.idNVE = params['idNVE'];
        },
        error => {
            this.errorHandler(error);
        });

        this.carregaNVE();


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
                this.nve.idNCM = res.idNCM;
                this.nve.cdNCM = res.cdNCM;
                this.nve.dsNCM = res.dsNCM;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.nve.idNCM = null;
        }
    }

    carregaNVE(): void {
        if (this.idNVE !== undefined) {
            this.isLoadPanelVisible = true;
            this.nveService.getNve(this.idNVE).subscribe((res: Nve) => {
                this.isLoadPanelVisible = false;
                this.nve = res;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.nve = new Nve();
        }
    }

    voltar(): void {
        this.router.navigate(['listanve']);
    }

    onFormSubmit = function(e) {

        let inputIdNVE = '';

        if (this.idNVE !== undefined) {
            inputIdNVE = this.idNVE.toString();
        }

        if (this.nve.cdNCM.length < 8) {
          this.msgErroValidacao = 'Código NCM inválido.';
            this.isPopupErroVisible = true;
            return false;
        } else {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmByCode(this.nve.cdNCM).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                if (res === undefined || res === null) {
                    this.msgErroValidacao = 'Código NCM não encontrado.';
                    this.isPopupErroVisible = true;
                    return false;
                } else {
                    this.nve.idNCM = res.idNCM;
                    this.nve.cdNCM = res.cdNCM;
                    this.nve.dsNCM = res.dsNCM;

                    const nveToDbToDb: NveToDb = new NveToDb();

                    if (this.nve.idNVE != null && this.nve.idNVE !== undefined) {
                        nveToDbToDb.IdNVE = this.nve.idNVE;
                    }

                    nveToDbToDb.IdNCM = this.nve.idNCM;
                    nveToDbToDb.DsNivel = this.nve.dsNivel;
                    nveToDbToDb.DsAtributo = this.nve.dsAtributo;
                    nveToDbToDb.DsEspecificacao = this.nve.dsEspecificacao;
                    nveToDbToDb.CdEspecificacao = this.nve.cdEspecificacao;
                    nveToDbToDb.FlAtivo = true;
                    nveToDbToDb.DtCriacao = new Date();
                    this.isLoadPanelVisible = true;
                    this.nveService.saveNve(nveToDbToDb).subscribe(retoroSalvar => {
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
        this.router.navigate(['listanve']);
    }

    clienteObrigatorio(e): boolean {
        const retorno: boolean = e.validator._isHidden !== false;
        return retorno;
    }
}

