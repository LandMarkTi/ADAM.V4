import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TratAdmService } from '../../../shared/services/tratAdm.service';
import { TratAdm } from '../../../shared/models/tratAdm.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
@Component({
    selector: 'app-listatratadm',
    templateUrl: './listatratadm.component.html',
    styleUrls: ['./listatratadm.component.scss'],
    animations: [routerTransition()],
    providers: [TratAdmService]
})
export class ListaTratAdmComponent implements OnInit {
    tratAdms: TratAdm[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    constructor(private tratAdmService: TratAdmService, private router: Router, private autenticacaoService: AutenticacaoService) {
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
        this.tratAdmService.listTratAdm().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.tratAdms = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    deletar(e, data) {
        this.idExclusao  = data.row.data.idTratamentoAdministrativo;
        this.isPopupConfimarVisible = true;
    }

    editar(e, data) {
        const idTratamentoAdministrativo: number = data.row.data.idTratamentoAdministrativo;
        this.router.navigate(['tratadm'], { queryParams: { 'idTratamentoAdministrativo': idTratamentoAdministrativo } } );
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idTratamentoAdministrativo;
        this.isPopupConfimarAtivarVisible = true;
    }

    novoTratAdm() {
        this.router.navigate(['tratadm']);
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
        this.tratAdmService.definirStatusAtivo(this.idExclusao, false).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
        this.tratAdmService.definirStatusAtivo(this.idAtivacao, true).pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
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
