import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { NeshService } from '../../../shared/services/nesh.service';
import { NcmService } from '../../../shared/services/ncm.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Nesh, NeshToDb } from 'src/app/shared/models/nesh.model';
import { Ncm } from 'src/app/shared/models/ncm.model';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-nesh',
    templateUrl: './nesh.component.html',
    styleUrls: ['./nesh.component.scss'],
    animations: [routerTransition()],
    providers: [NeshService]
})
export class NeshComponent implements OnInit {

    constructor(private ncmService: NcmService, private neshService: NeshService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    @Input() idNesh: number;
    nesh: Nesh;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    isLoadPanelVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    isInternalUser: boolean;
    idUsuario: number;

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idNesh = params['idNesh'];
        },
        error => {
            this.errorHandler(error);
        });

        this.carregaNesh();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    updateNcmInfo(e) {
        if (e.value.length === 4) {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmByCode(e.value).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                this.nesh.cdNCM = res.cdNCM;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.nesh.idNesh = null;
        }
    }

    carregaNesh(): void {
        if (this.idNesh !== undefined) {
            this.isLoadPanelVisible = true;
            this.neshService.getNesh(this.idNesh).subscribe((res: Nesh) => {
                this.isLoadPanelVisible = false;
                this.nesh = res;
            });
        } else {
            this.nesh = new Nesh();
        }
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        this.router.navigate(['listanesh']);
    }

    onFormSubmit = function(e) {

        let inputIdNesh = '';

        if (this.idNesh !== undefined) {
            inputIdNesh = this.idNesh.toString();
        }

        if (this.nesh.cdNCM.length < 4) {
          this.msgErroValidacao = 'Código NCM inválido.';
            this.isPopupErroVisible = true;
            return false;
        } else {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmBy4CharsCode(this.nesh.cdNCM).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                if (res === undefined || res === null) {
                    this.msgErroValidacao = 'Código NCM não encontrado.';
                    this.isPopupErroVisible = true;
                    return false;
                } else {
                    this.isLoadPanelVisible = true;
                    this.neshService.VerificarNCMInexistente(inputIdNesh, this.nesh.cdNCM.toString()).subscribe(retornoNome => {
                        this.isLoadPanelVisible = false;
                        if (!retornoNome) {
                            this.msgErroValidacao = 'NCM já utilizada.';
                            this.isPopupErroVisible = true;
                            return false;
                        } else {
                            const neshToDbToDb: NeshToDb = new NeshToDb();

                            if (this.nesh.idNesh != null && this.nesh.idNesh !== undefined) {
                                neshToDbToDb.IdNesh = this.nesh.idNesh;
                            }

                            neshToDbToDb.CdNCM = this.nesh.cdNCM;
                            neshToDbToDb.DsNesh = this.nesh.dsNesh;
                            neshToDbToDb.FlAtivo = true;
                            neshToDbToDb.DtCriacao = new Date();
                            this.isLoadPanelVisible = true;
                            this.neshService.saveNesh(neshToDbToDb).subscribe(retoroSalvar => {
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
        this.router.navigate(['listanesh']);
    }

    clienteObrigatorio(e): boolean {
        const retorno: boolean = e.validator._isHidden !== false;
        return retorno;
    }
}

