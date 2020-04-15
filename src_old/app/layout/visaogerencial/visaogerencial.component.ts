import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ItemService } from '../../shared/services/item.service';
import { ItemGerencial } from '../../shared/models/itemgerencial.model';
import { DefinicaoElaborador } from '../../shared/models/definicaoElaborador.model';
import { FiltroBuscaGerencial } from '../../shared/models/filtroBuscaGerencial.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AlertComponent } from '../bs-component/components';
import { Cliente } from '../../shared/models/cliente.model';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { Usuario } from '../../shared/models/usuario.model';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { DxDataGridComponent,
    DxDataGridModule,
    DxSelectBoxModule } from 'devextreme-angular';

@Component({
    selector: 'app-visaogerencial',
    templateUrl: './visaogerencial.component.html',
    styleUrls: ['./visaogerencial.component.scss'],
    animations: [routerTransition()],
    providers: [ItemService]
})
export class VisaoGerencialComponent implements OnInit {
    itens: ItemGerencial[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    selectedRows: number[];
    isPopupVisible = false;
    msgSucesso: string;

    isPopupErroVisible = false;
    msgErroValidacao: string;
    clientes: Cliente[];
    idCliente: number;

    usuarios: Usuario[];
    idUsuarioDdl: number;

    chkAtivos = true;
    chkInativos = false;

    chkStatusItemInicial = true;
    chkStatusItemElaboracao = true;
    chkStatusItemPendenteCliente = true;
    chkStatusItemRevisao = true;
    chkStatusItemFinalizado = true;
    chkStatusTodos = true;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    isPopupConfimarSelecao = false;
    isPopupConfimarRetorno = false;

    idUsuario: number;

    chkPrioridadeAmarelo = true;
    chkPrioridadeVerde = true;
    chkPrioridadeVermelho = true;
    chkPrioridadeAzul = true;

    filter: any;

    @ViewChild('gridVisaoGerencial', { static: false }) dataGrid: DxDataGridComponent;

    constructor(private autenticacaoService: AutenticacaoService, private itemService: ItemService, private clienteService: ClienteService, private usuarioService: UsuarioService, private router: Router) {

        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (!this.isInternalUser) {
            this.router.navigate(['clientelistapendencias']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }

    ngOnInit() {
        this.carregaClientes();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    checkStatus_valueChanged(e) {
        this.chkStatusTodos = this.chkStatusItemInicial && this.chkStatusItemElaboracao && this.chkStatusItemPendenteCliente && this.chkStatusItemRevisao && this.chkStatusItemFinalizado;
    }

    checkTodos_valueChanged(e) {
        const valor = e.value;
        const elemento = e.element.id;
        const evento = e.event.type;
        if (evento === 'dxclick' && elemento === 'checkTodos') {
            this.chkStatusItemInicial = valor;
            this.chkStatusItemElaboracao = valor;
            this.chkStatusItemPendenteCliente = valor;
            this.chkStatusItemRevisao = valor;
            this.chkStatusItemFinalizado = valor;
        }

    }

    onContentReady(e): void {
        /*
        this.filter = e.component.getCombinedFilter(true);
        if (this.filter) {
            // Filter is applied
            localStorage.removeItem('filtroVisaoGeral');
            localStorage.setItem('filtroVisaoGeral', this.filter);
        } else if (this.itens.length > 0) {
            // Filter is not applied
            const filtro = localStorage.getItem('filtroVisaoGeral');
            if (filtro) {
                this.dataGrid.instance.filter(filtro);

            }
        }
        */
    }

    carregaClientes(): void {
        this.isLoadPanelVisible = true;
        this.clienteService.listarClientesAtivos()
              .subscribe(retoroListCliente => {
                this.isLoadPanelVisible = false;
                  this.clientes = retoroListCliente;
                  this.carregaUsuario();
              },
              error => {
                  this.errorHandler(error);
              });
    }

    carregaUsuario(): void {
        this.isLoadPanelVisible = true;
        this.usuarioService.listarUsuariosUYAtivos()
              .subscribe(retoroList => {
                this.isLoadPanelVisible = false;
                  this.usuarios = retoroList;
              },
              error => {
                  this.errorHandler(error);
              });
    }

    carregaLista(): void {

        const input = new FiltroBuscaGerencial();

        if (this.idCliente !== undefined && this.idCliente !== null) {
            input.idCliente = this.idCliente;
        }

        if (this.idUsuarioDdl !== undefined && this.idUsuarioDdl !== null) {
            input.idUsuario = this.idUsuarioDdl;
        }

        input.chkAtivos = this.chkAtivos;
        input.chkInativos = this.chkInativos;

        input.chkStatusItemInicial = this.chkStatusItemInicial;
        input.chkStatusItemElaboracao = this.chkStatusItemElaboracao;
        input.chkStatusItemPendenteCliente = this.chkStatusItemPendenteCliente;
        input.chkStatusItemRevisao = this.chkStatusItemRevisao;
        input.chkStatusItemFinalizado = this.chkStatusItemFinalizado;
        input.chkPrioridadeAmarelo = this.chkPrioridadeAmarelo;
        input.chkPrioridadeVerde = this.chkPrioridadeVerde;
        input.chkPrioridadeVermelho = this.chkPrioridadeVermelho;
        input.chkPrioridadeAzul = this.chkPrioridadeAzul;

        this.isLoadPanelVisible = true;

        this.itemService.listaGerencial(input).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.itens = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    deletar(e, data) {
        this.idExclusao  = data.row.data.idItem;
        this.isPopupConfimarVisible = true;
    }

    elaborar(e, data) {
        const idRequest: number = data.row.data.idItem;
        this.router.navigate(['elaboracao'], { queryParams: { 'idItem': data.row.data.idItem } } );
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idItem;
        this.isPopupConfimarAtivarVisible = true;
    }

    visualizar(e, data): void {
        this.router.navigate(['item'], { queryParams: { 'idItem': data.row.data.idItem, 'sl': true } } );
    }

    onCellPrepared(e) {
        if (e.rowType === 'data' && e.column.dataField === 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.flAtivo) {
                ele.firstElementChild.children[0].children[0].children[0].children[0].children[0].style.display = 'block';
                ele.firstElementChild.children[0].children[0].children[0].children[1].children[0].style.display = 'block';
                ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.display = 'block';
                ele.firstElementChild.children[0].children[0].children[0].children[3].children[0].style.display = 'none';
            } else {
                ele.firstElementChild.children[0].children[0].children[0].children[0].children[0].style.display = 'none';
                ele.firstElementChild.children[0].children[0].children[0].children[1].children[0].style.display = 'none';
                ele.firstElementChild.children[0].children[0].children[0].children[2].children[0].style.display = 'none';
                ele.firstElementChild.children[0].children[0].children[0].children[3].children[0].style.display = 'block';
            }

        } else if (e.rowType === 'data' && e.column.dataField === 'dsPrioridade') {
            const ele = e.cellElement;
            const dsCor = e.data.dsPrioridade;

            switch (dsCor) {
                case 'AMARELO': {
                    // ele.firstElementChild.style.color = 'yellow';
                    ele.firstElementChild.innerHTML = '<img src="/assets/images/indicadorAMARELO.png" width="20" />';
                    break;
                }
                case 'VERDE': {
                    // ele.firstElementChild.style.color = 'green';
                    ele.firstElementChild.innerHTML = '<img src="/assets/images/indicadorVERDE.png" width="20" />';
                    break;
                }
                case 'VERMELHO': {
                    // ele.firstElementChild.style.color = 'red';
                    ele.firstElementChild.innerHTML = '<img src="/assets/images/indicadorVERMELHO.png" width="20" />';
                    break;
                }
                case 'AZUL': {
                    // ele.firstElementChild.style.color = 'blue';
                    ele.firstElementChild.innerHTML = '<img src="/assets/images/indicadorAZUL.png" width="20" />';
                    break;
                }
            }
        } else if (e.rowType === 'data' && e.column.dataField !== 'flAtivo' && e.column.dataField !== 'dsPrioridade') {
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
        this.itemService.definirStatusAtivo(this.idExclusao, false).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
        this.itemService.definirStatusAtivo(this.idAtivacao, true).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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

    selecionar() {
        if (this.selectedRows === undefined || this.selectedRows === null || this.selectedRows.length === 0) {
            this.msgErroValidacao = 'Nenhum item selecionado.';
            this.isPopupErroVisible = true;
            return;
        }

        this.isPopupConfimarSelecao = true;


    }

    confirmacaoSelecaoOK(): void {
        const input = new DefinicaoElaborador();
        input.idUsuario = this.idUsuario;
        input.listaItens = this.selectedRows;

        this.isLoadPanelVisible = true;
        this.itemService.defineElaborador(input).pipe(takeUntil(this.destroy$)).subscribe((res: number[]) => {
            this.isLoadPanelVisible = false;
            this.selectedRows = [];
            this.msgSucesso = 'Elaborção selecionada com suceeso.';
            this.isPopupVisible = true;
            this.carregaLista();
            this.idAtivacao = null;
            this.isPopupConfimarSelecao = false;
        });


    }

    confirmacaoSelecaoCancelar(): void {
        this.isPopupConfimarSelecao = false;
    }

    devolver() {
        if (this.selectedRows === undefined || this.selectedRows === null || this.selectedRows.length === 0) {
            this.msgErroValidacao = 'Nenhum item selecionado.';
            this.isPopupErroVisible = true;
            return;
        }

        this.isPopupConfimarRetorno = true;
    }

    confirmacaoRetornoOK(): void {
        const input = new DefinicaoElaborador();
        input.idUsuario = this.idUsuario;
        input.listaItens = this.selectedRows;

        this.isLoadPanelVisible = true;
        this.itemService.devolver(input).pipe(takeUntil(this.destroy$)).subscribe((res: number[]) => {
            this.isLoadPanelVisible = false;
            this.selectedRows = [];
            this.msgSucesso = 'Devolução realizada com suceeso.';
            this.isPopupVisible = true;
            this.carregaLista();
            this.idAtivacao = null;
            this.isPopupConfimarRetorno = false;
        },
        error => {
            this.errorHandler(error);
        });
    }

    confirmacaoRetornoCancelar(): void {
        this.isPopupConfimarRetorno = false;
    }

    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }
}
