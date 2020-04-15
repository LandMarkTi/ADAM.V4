import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TratAdmService } from '../../../shared/services/tratAdm.service';
import { NcmService } from '../../../shared/services/ncm.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TratAdm, TratAdmToDb } from 'src/app/shared/models/tratAdm.model';
import { Ncm } from 'src/app/shared/models/ncm.model';
import { identifierModuleUrl } from '@angular/compiler';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-tratAdm',
    templateUrl: './tratAdm.component.html',
    styleUrls: ['./tratAdm.component.scss'],
    animations: [routerTransition()],
    providers: [TratAdmService]
})
export class TratAdmComponent implements OnInit {

    constructor(private ncmService: NcmService, private tratAdmService: TratAdmService,
        private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
            this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

            if (!this.isInternalUser) {
                this.router.navigate(['login']);
            } else {
                this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
            }
        }
    @Input() IdTratamentoAdministrativo: number;
    tratAdm: TratAdm;
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
            this.IdTratamentoAdministrativo = params['idTratamentoAdministrativo'];
        });

        this.carregaTratAdm();

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
                this.tratAdm.idNCM = res.idNCM;
                this.tratAdm.cdNCM = res.cdNCM;
                this.tratAdm.dsNCM = res.dsNCM;
            });
        } else {
            this.tratAdm.idNCM = null;
        }
    }

    carregaTratAdm(): void {
        if (this.IdTratamentoAdministrativo !== undefined) {
            this.isLoadPanelVisible = true;
            this.tratAdmService.getTratAdm(this.IdTratamentoAdministrativo).subscribe((res: TratAdm) => {
                this.isLoadPanelVisible = false;
                this.tratAdm = res;
            });
        } else {
            this.tratAdm = new TratAdm();
        }
    }

    voltar(): void {
        this.router.navigate(['listtratadm']);
    }

    onFormSubmit = function(e) {

        let inputIdTratamentoAdministrativo = '';

        if (this.IdTratamentoAdministrativo !== undefined) {
            inputIdTratamentoAdministrativo = this.IdTratamentoAdministrativo.toString();
        }

        if (this.tratAdm.cdNCM.length < 8) {
          this.msgErroValidacao = 'Código NCM inválido.';
            this.isPopupErroVisible = true;
            return false;
        } else {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmByCode(this.tratAdm.cdNCM).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                if (res === undefined || res === null) {
                    this.msgErroValidacao = 'Código NCM não encontrado.';
                    this.isPopupErroVisible = true;
                    return false;
                } else {
                    this.tratAdm.idNCM = res.idNCM;
                    this.tratAdm.cdNCM = res.cdNCM;
                    this.tratAdm.dsNCM = res.dsNCM;

                    const tratadmToDb: TratAdmToDb = new TratAdmToDb();

                    if (this.tratAdm.idTratamentoAdministrativo != null && this.tratAdm.idTratamentoAdministrativo !== undefined) {
                        tratadmToDb.IdTratamentoAdministrativo = this.tratAdm.idTratamentoAdministrativo;
                    }

                    tratadmToDb.IdNCM = this.tratAdm.idNCM;
                    tratadmToDb.DtInicial = this.tratAdm.dtInicial;
                    tratadmToDb.DtFinal = this.tratAdm.dtFinal;
                    tratadmToDb.DsTipo = this.tratAdm.dsTipo;
                    tratadmToDb.DsOrgao = this.tratAdm.dsOrgao;
                    tratadmToDb.DsFinalidade = this.tratAdm.dsFinalidade;
                    tratadmToDb.DsTratamento = this.tratAdm.dsTratamento;
                    tratadmToDb.DsDestaque = this.tratAdm.dsDestaque;
                    tratadmToDb.DsDescDestaque = this.tratAdm.dsDescDestaque;
                    tratadmToDb.DsFuncao = this.tratAdm.dsFuncao;
                    tratadmToDb.DsPais = this.tratAdm.dsPais;
                    tratadmToDb.DsExcecao = this.tratAdm.dsExcecao;
                    tratadmToDb.DsNotas = this.tratAdm.dsNotas;
                    tratadmToDb.FlAtivo = true;
                    tratadmToDb.DtCriacao = new Date();
                    this.isLoadPanelVisible = true;
                    this.tratAdmService.saveTratAdm(tratadmToDb).subscribe(retoroSalvar => {
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
        this.router.navigate(['listtratadm']);
    }

    clienteObrigatorio(e): boolean {
        const retorno: boolean = e.validator._isHidden !== false;
        return retorno;
    }
}

