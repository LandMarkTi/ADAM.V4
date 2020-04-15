import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { SolicitacaoService } from '../../shared/services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AlertComponent } from '../bs-component/components';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-listasoliociatcao',
    templateUrl: './listasolicitacao.component.html',
    styleUrls: ['./listasolicitacao.component.scss'],
    animations: [routerTransition()],
    providers: [SolicitacaoService]
})

export class ListaSolicitacaoComponent implements OnInit {
    solicitacoes: Solicitacao[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    constructor(private solicitacaoService: SolicitacaoService, private router: Router, private autenticacaoService: AutenticacaoService) {
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
        this.solicitacaoService.listSolicitacoes().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.solicitacoes = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    deletar(e, data) {
        this.idExclusao  = data.row.data.idRequest;
        this.isPopupConfimarVisible = true;
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idRequest;
        this.isPopupConfimarAtivarVisible = true;
    }

    listarItens(e, data): void {
        this.router.navigate(['itens'], { queryParams: { 'idRequest': data.row.data.idRequest } } );
    }

    editarSolicitacao(e, data): void {
        this.router.navigate(['solicitacaowf'], { queryParams: { 'idSolicitacao': data.row.data.idSolicitacao } } );
    }

    novaSolicitacao() {
        this.router.navigate(['solicitacaowf']);
    }

    onCellPrepared(e) {
        if (e.rowType === 'data' && e.column.dataField === 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.flAtivo) {
                // ele.firstElementChild.children[0].children[0].children[0].children[0].children[0].style.display = 'block';
                // ele.firstElementChild.children[0].children[0].children[0].children[1].children[0].style.display = 'block';
                // ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.display = 'none';
                // ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.marginLeft = '0px';
            } else {
                // ele.firstElementChild.children[0].children[0].children[0].children[0].children[0].style.display = 'none';
                // ele.firstElementChild.children[0].children[0].children[0].children[1].children[0].style.display = 'none';
                // ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.display = 'block';
                // ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.marginLeft = '15px';
            }
        } else if (e.rowType === 'data' && e.column.dataField !== 'flAtivo') {
            const ele = e.cellElement;

            if (e.column.dataField === 'laudos') {
                if (e.data.laudos) {
                    ele.firstElementChild.style.display = 'block';
                } else {
                    ele.firstElementChild.style.display = 'none';
                }
            }

            if (e.column.dataField === 'vistas') {
                if (e.data.vistas) {
                    ele.firstElementChild.style.display = 'block';
                } else {
                    ele.firstElementChild.style.display = 'none';
                }
            }

            if (e.data.flAtivo) {
                ele.style.color = 'black';
            } else {
                ele.style.color = 'gray';
            }
        }
    }

    urgenciaTexto(rowData) {
        if (rowData.idTipoUrgencia === 1) {
            return 'Sim';
        } else {
            return 'Não';
        }
    }


    dataAprovacaoUrgenciaTexto(rowData) {

        let retorno = '';

        if (rowData.dataAprovacaoUrgencia !== null) {
            const dt = new Date(rowData.dataAprovacaoUrgencia);
            const curr_date = dt.getDate();
            const curr_month = dt.getMonth() + 1; // Months are zero based
            const curr_year = dt.getFullYear();
            retorno = ('00' + curr_date).slice(-2) + '/' + ('00' + curr_month).slice(-2) + '/' + curr_year;
        }

          return retorno;

    }

    confirmacaoOK(): void {
        this.isPopupConfimarVisible = false;
        /*
        this.isLoadPanelVisible = true;
        this.requestService.definirStatusAtivo(this.idExclusao, false).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
            this.isLoadPanelVisible = false;
            this.carregaLista();
            this.idExclusao = null;
        },
        error => {
            this.errorHandler(error);
        });
        */
    }


    confirmacaoCancelar(): void {
        this.isPopupConfimarVisible = false;
        this.idExclusao = null;
    }

    confirmacaoAtivarOK(): void {
        this.isPopupConfimarAtivarVisible = false;
        /*
        this.isLoadPanelVisible = true;
        this.solicitacaoService.definirStatusAtivo(this.idAtivacao, true).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
            this.isLoadPanelVisible = false;
            this.carregaLista();
            this.idAtivacao = null;
        },
        error => {
            this.errorHandler(error);
        });
        */
    }

    confirmacaoAtivarCancelar(): void {
        this.isPopupConfimarAtivarVisible = false;
        this.idAtivacao = null;
    }

}
