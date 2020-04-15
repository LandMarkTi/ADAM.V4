import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { RequestService } from '../../shared/services/request.service';
import { Request } from '../../shared/models/request.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AlertComponent } from '../bs-component/components';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-listarequests',
    templateUrl: './listarequests.component.html',
    styleUrls: ['./listarequests.component.scss'],
    animations: [routerTransition()],
    providers: [RequestService]
})
export class ListaRequestsComponent implements OnInit {
    requests: Request[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    constructor(private requestService: RequestService, private router: Router, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }

    ngOnInit() {
        this.carregaLista();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }


    carregaLista(): void {
        this.isLoadPanelVisible = true;
        this.requestService.listRequest().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.requests = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    deletar(e, data) {
        this.idExclusao  = data.row.data.idRequest;
        this.isPopupConfimarVisible = true;
    }

    editar(e, data) {
        const idRequest: number = data.row.data.idRequest;
        this.router.navigate(['request'], { queryParams: { 'idRequest': idRequest } } );
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idRequest;
        this.isPopupConfimarAtivarVisible = true;
    }

    listarItens(e, data): void {
        this.router.navigate(['itens'], { queryParams: { 'idRequest': data.row.data.idRequest } } );
    }

    novoRquest() {
        this.router.navigate(['request']);
    }

    onCellPrepared(e) {
        if (e.rowType === 'data' && e.column.dataField === 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.flAtivo) {
                ele.firstElementChild.children[0].children[0].children[0].children[0].children[0].style.display = 'block';
                ele.firstElementChild.children[0].children[0].children[0].children[1].children[0].style.display = 'block';
                ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.display = 'none';
                ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.marginLeft = '0px';
            } else {
                ele.firstElementChild.children[0].children[0].children[0].children[0].children[0].style.display = 'none';
                ele.firstElementChild.children[0].children[0].children[0].children[1].children[0].style.display = 'none';
                ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.display = 'block';
                ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.marginLeft = '15px';
            }
        } else if (e.rowType === 'data' && e.column.dataField !== 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.flAtivo) {
                ele.style.color = 'black';
            } else {
                ele.style.color = 'gray';
            }
        }
    }

    statusTexto(rowData) {
        if (rowData.flAtivo) {
            return 'Ativo';
        } else {
            return 'Inativo';
        }
    }

    confirmacaoOK(): void {
        this.isPopupConfimarVisible = false;
        this.isLoadPanelVisible = true;
        this.requestService.definirStatusAtivo(this.idExclusao, false).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
            this.isLoadPanelVisible = false;
            this.carregaLista();
            this.idExclusao = null;
        },
        error => {
            this.errorHandler(error);
        });
    }

    confirmacaoCancelar(): void {
        this.isPopupConfimarVisible = false;
        this.idExclusao = null;
    }

    confirmacaoAtivarOK(): void {
        this.isPopupConfimarAtivarVisible = false;
        this.isLoadPanelVisible = true;
        this.requestService.definirStatusAtivo(this.idAtivacao, true).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
            this.isLoadPanelVisible = false;
            this.carregaLista();
            this.idAtivacao = null;
        },
        error => {
            this.errorHandler(error);
        });
    }

    confirmacaoAtivarCancelar(): void {
        this.isPopupConfimarAtivarVisible = false;
        this.idAtivacao = null;
    }

}
