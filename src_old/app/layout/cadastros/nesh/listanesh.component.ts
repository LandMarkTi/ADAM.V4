import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { NeshService } from '../../../shared/services/nesh.service';
import { Nesh } from '../../../shared/models/nesh.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-listaNesh',
    templateUrl: './listaNesh.component.html',
    styleUrls: ['./listaNesh.component.scss'],
    animations: [routerTransition()],
    providers: [NeshService]
})
export class ListaNeshComponent implements OnInit {
    Neshs: Nesh[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    constructor(private neshService: NeshService, private router: Router, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

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
        this.neshService.listNesh().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.Neshs = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    deletar(e, data) {
        this.idExclusao  = data.row.data.idNesh;
        this.isPopupConfimarVisible = true;
    }

    editar(e, data) {
        const idNesh: number = data.row.data.idNesh;
        this.router.navigate(['nesh'], { queryParams: { 'idNesh': idNesh } } );
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idNesh;
        this.isPopupConfimarAtivarVisible = true;
    }

    novoNesh() {
        this.router.navigate(['nesh']);
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
        this.neshService.definirStatusAtivo(this.idExclusao, false).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
        this.neshService.definirStatusAtivo(this.idAtivacao, true).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
