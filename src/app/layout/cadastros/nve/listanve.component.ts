import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { NveService } from '../../../shared/services/nve.service';
import { Nve } from '../../../shared/models/nve.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-listanve',
    templateUrl: './listanve.component.html',
    styleUrls: ['./listanve.component.scss'],
    animations: [routerTransition()],
    providers: [NveService]
})
export class ListaNveComponent implements OnInit {
    nves: Nve[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    constructor(private nveService: NveService, private router: Router, private autenticacaoService: AutenticacaoService) {
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
        this.nveService.listNve().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.nves = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    deletar(e, data) {
        this.idExclusao  = data.row.data.idNVE;
        this.isPopupConfimarVisible = true;
    }

    editar(e, data) {
        const idNVE: number = data.row.data.idNVE;
        this.router.navigate(['nve'], { queryParams: { 'idNVE': idNVE } } );
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idNVE;
        this.isPopupConfimarAtivarVisible = true;
    }

    novoNVE() {
        this.router.navigate(['nve']);
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
        this.nveService.definirStatusAtivo(this.idExclusao, false).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
        this.nveService.definirStatusAtivo(this.idAtivacao, true).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
