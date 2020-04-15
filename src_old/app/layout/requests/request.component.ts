import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { RequestService } from '../../shared/services/request.service';
import { EscopoAnaliseService } from '../../shared/services/escopoAnalise.service';
import { EscopoAnalise } from '../../shared/models/escopoAnalise.model';
import { RequestEscopoAnaliseService } from '../../shared/services/requestescopoanalise.service';
import { Request, RequestToDb, StatusRequest } from '../../shared/models/request.model';
import { Cliente } from '../../shared/models/cliente.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { IdText } from 'src/app/shared/models/IdText.model';
import { RequestEscopoAnaliseToDb, RequestEscopoAnaliseItem } from 'src/app/shared/models/requestEscopoAnalise.model';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.scss'],
    animations: [routerTransition()],
    providers: [ClienteService, RequestService]
})
export class RequestComponent implements OnInit {

    constructor(private requestService: RequestService, private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private escopoAnaliseService: EscopoAnaliseService, private requestEscopoAnaliseService: RequestEscopoAnaliseService, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    @Input() idRequest: number;
    request: Request;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    clientes: Cliente[];
    idCliente: number;

    escopos: DataSource;
    selecionados: number[] = [];

    multiple = 'multiple';

    isInternalUser: boolean;
    idUsuario: number;


    isLoadPanelVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idRequest = params['idRequest'];
        });

        this.carregaClientes();

    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    carregaClientes(): void {
        this.isLoadPanelVisible = true;
        this.clienteService.listarClientesAtivos()
              .subscribe(retoroListCliente => {
                this.isLoadPanelVisible = false;
                  this.clientes = retoroListCliente;

                  this.carregaRequest();
              },
              error => {
                  this.errorHandler(error);
              });
    }

    carregaRequest(): void {
        if (this.idRequest !== undefined) {
            this.isLoadPanelVisible = true;
            this.requestService.getRequest(this.idRequest).subscribe((res: Request) => {
                this.isLoadPanelVisible = false;
                this.request = res;
                this.idCliente = this.request.idCliente;
                this.isLoadPanelVisible = true;
                this.escopoAnaliseService.listarEscoposDoRequest(this.idRequest).subscribe((res: EscopoAnalise[]) => {
                    this.isLoadPanelVisible = false;
                    this.escopos = new DataSource({
                        store: new ArrayStore({
                            key: 'id',
                            data: this.converteEscopoAnaliseToArrayIdText(res)
                        })
                    });
                },
                error => {
                    this.errorHandler(error);
                });
            });
        } else {
            const idStatusAtivo = 1;
            this.request = new Request();
            this.isLoadPanelVisible = true;
            this.requestService.obtemStatusRequest(idStatusAtivo).subscribe((res: StatusRequest) => {
                this.request.idStatusRequest = res.idStatusRequest;
                this.request.dsStatusRequest = res.dsStatusRequest;

                this.escopoAnaliseService.listarEscopoAnaliseAtivos().subscribe((res1: EscopoAnalise[]) => {
                    this.isLoadPanelVisible = false;
                    this.escopos = new DataSource({
                        store: new ArrayStore({
                            key: 'id',
                            data: this.converteEscopoAnaliseToArrayIdText(res1)
                        })
                    });
                },
                error => {
                    this.errorHandler(error);
                });
            },
            error => {
                this.errorHandler(error);
            });
        }
    }

    voltar(): void {
        this.router.navigate(['requests']);
    }

    onFormSubmit = function(e) {

        const requestToDb: RequestToDb = new RequestToDb();

        let inputIdRequest = '';

        if (this.request.idRequest != null && this.request.idRequest !== undefined) {
            requestToDb.IdRequest = this.request.idRequest;
            requestToDb.IdUsuarioUltimaModificacao = this.idUsuario;
            requestToDb.DtCriacao = new Date();
            inputIdRequest = this.request.idRequest.toString();
            requestToDb.IdUsuarioCriacao = this.request.idUsuarioCriacao;

        } else {
            requestToDb.IdUsuarioCriacao = this.idUsuario;
        }

        requestToDb.CdDebito = this.request.cdDebito;
        requestToDb.CdRequest = this.request.cdRequest;
        requestToDb.NmRequest = this.request.nmRequest;
        requestToDb.DtCriacao = this.request.dtCriacao;
        requestToDb.IdCliente = this.idCliente;
        requestToDb.IdStatusRequest = this.request.idStatusRequest;
        requestToDb.FlAtivo = true;

        this.isLoadPanelVisible = true;
        this.requestService.verificarNomeInexistente(inputIdRequest, this.idCliente, this.request.nmRequest)
        .subscribe(retornoNome => {
            this.isLoadPanelVisible = false;
            if (!retornoNome) {
              this.msgErroValidacao = 'Nome já utilizado.';
              this.isPopupErroVisible = true;
              return false;
            } else if (this.selecionados === undefined || this.selecionados.length === 0) {
                this.msgErroValidacao = 'Nenhum escopo de análise selecionado.';
                this.isPopupErroVisible = true;
                return false;
            } else {
                this.isLoadPanelVisible = true;
                this.requestService.saveRequest(requestToDb).subscribe(retoroSalvar => {
                    this.isLoadPanelVisible = false;
                const idRequestInput = retoroSalvar.idRequest;

                const requestEscopoAnalise: RequestEscopoAnaliseToDb = new RequestEscopoAnaliseToDb();

                requestEscopoAnalise.IdRequest = idRequestInput;
                requestEscopoAnalise.Itens = [];

                for (let i = 0; i < this.selecionados.length; i++) {

                    const item: RequestEscopoAnaliseItem = new RequestEscopoAnaliseItem();
                    item.IdEscopoAnalise = this.selecionados[i];
                    item.IdRequest = idRequestInput;
                    requestEscopoAnalise.Itens.push(item);
                }

                this.isLoadPanelVisible = true;
                this.requestEscopoAnaliseService.saveRequestEscopoAnalise(requestEscopoAnalise).subscribe(retoroSalvarRequestEscopoAnalise => {
                    this.isLoadPanelVisible = false;
                    this.isPopupVisible = true;
                },
                error => {
                    this.errorHandler(error);
                });
              },
              error => {
                  this.errorHandler(error);
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
        this.router.navigate(['requests']);
    }

    converteEscopoAnaliseToArrayIdText(escopos: EscopoAnalise[]): IdText[] {
        const array: IdText[] = [];

        for (let i = 0; i < escopos.length; i++) {
            const escopo = escopos[i];
            const arrayItem = new IdText();
            arrayItem.id = escopo.idEscopoAnalise;
            arrayItem.text = escopo.dsEscopo;
            array.push(arrayItem);

            if (escopo.flUtilizado === true) {
                this.selecionados.push(escopo.idEscopoAnalise);
            }
        }

        return array;
    }

}

