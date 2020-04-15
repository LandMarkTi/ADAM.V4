import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { RequestService } from '../../../shared/services/request.service';
import { EscopoAnaliseService } from '../../../shared/services/escopoanalise.service';
import { RequestEscopoAnaliseService } from '../../../shared/services/requestescopoanalise.service';
import { Request, RequestToDb, StatusRequest } from '../../../shared/models/request.model';
import { Cliente } from '../../../shared/models/cliente.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { EscopoAnalise } from 'src/app/shared/models/escopoAnalise.model';
import { IdText } from 'src/app/shared/models/IdText.model';
import { RequestEscopoAnaliseToDb, RequestEscopoAnaliseItem } from 'src/app/shared/models/requestEscopoAnalise.model';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-clienterequest',
    templateUrl: './clienterequest.component.html',
    styleUrls: ['./clienterequest.component.scss'],
    animations: [routerTransition()],
    providers: [ClienteService, RequestService]
})
export class ClienteRequestComponent implements OnInit {

    constructor(private requestService: RequestService, private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private escopoAnaliseService: EscopoAnaliseService, private requestEscopoAnaliseService: RequestEscopoAnaliseService, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (this.isInternalUser) {
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

    multiple = 'multiple';

    isInternalUser: boolean;
    idUsuario: number;


    isLoadPanelVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idRequest = params['idRequest'];
        });

        this.carregaRequest();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    carregaRequest(): void {
        if (this.idRequest !== undefined) {
            this.isLoadPanelVisible = true;
            this.requestService.getRequest(this.idRequest).subscribe((res: Request) => {
                this.isLoadPanelVisible = false;
                this.request = res;
            });
        } else {
            const idStatusAtivo = 1;
            this.request = new Request();
            this.request.idCliente = this.autenticacaoService.currentUserValue.idCliente;
            this.isLoadPanelVisible = true;
            this.requestService.obtemStatusRequest(idStatusAtivo).subscribe((res: StatusRequest) => {
                this.request.idStatusRequest = res.idStatusRequest;
                this.request.dsStatusRequest = res.dsStatusRequest;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        }
    }

    voltar(): void {
        this.router.navigate(['clienterequests']);
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
        requestToDb.IdCliente = this.request.idCliente;
        requestToDb.IdStatusRequest = this.request.idStatusRequest;
        requestToDb.FlAtivo = true;

        this.isLoadPanelVisible = true;
        this.requestService.verificarNomeInexistente(inputIdRequest, this.request.idCliente, this.request.nmRequest)
        .subscribe(retornoNome => {
            this.isLoadPanelVisible = false;
            if (!retornoNome) {
              this.msgErroValidacao = 'Nome já utilizado.';
              this.isPopupErroVisible = true;
              return false;
            } else {
                this.isLoadPanelVisible = true;
                this.requestService.saveRequest(requestToDb).subscribe(retoroSalvar => {
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
        e.preventDefault();
    };


    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    popup_hidden(e): void {
        this.router.navigate(['clienterequests']);
    }

}

