import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { RequestService } from '../../../shared/services/request.service';
import { Request } from '../../../shared/models/request.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AlertComponent } from '../../bs-component/components';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-clientelistarequests',
    templateUrl: './clientelistarequests.component.html',
    styleUrls: ['./clientelistarequests.component.scss'],
    animations: [routerTransition()],
    providers: [RequestService]
})
export class ClienteListaRequestsComponent implements OnInit {
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

        if (this.isInternalUser) {
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
        this.requestService.listRequestCliente(this.idUsuario).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.requests = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    editar(e, data) {
        const idRequest: number = data.row.data.idRequest;
        this.router.navigate(['clienterequest'], { queryParams: { 'idRequest': idRequest } } );
    }

    listarItens(e, data): void {
        this.router.navigate(['clienteitens'], { queryParams: { 'idRequest': data.row.data.idRequest } } );
    }

    novoRquest() {
        this.router.navigate(['clienterequest']);
    }

    onCellPrepared(e) {
        if (e.rowType === 'data' && e.column.dataField !== 'flAtivo') {
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

}
