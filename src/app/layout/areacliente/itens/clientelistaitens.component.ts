import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ItemService } from '../../../shared/services/item.service';
import { Item } from '../../../shared/models/item.model';
import { ErroImportacao } from '../../../shared/models/erroImportacao.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';


@Component({
    selector: 'app-clientelistaitens',
    templateUrl: './clientelistaitens.component.html',
    styleUrls: ['./clientelistaitens.component.scss'],
    animations: [routerTransition()],
    providers: [ItemService]
})
export class ClienteListaItensComponent implements OnInit {
    idRequest: number;
    itens: Item[];
    isPopupConfimarVisible = false;
    isPopupConfimarAtivarVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    idExclusao: number;
    idAtivacao: number;
    isShow = false;
    btnCarregarAtivo = false;
    items: Item[];
    fileToUpload: File = null;
    fileData: File = null;
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    errosImportacao: ErroImportacao[];
    isPopupErrosImportacaoVisible = false;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;
    btnUploadNaoVisivel = false;
    filePath = '';

    @ViewChild('myInput', {read: ElementRef, static: false}) private myInputVariable: ElementRef;

    constructor(private itemService: ItemService, private router: Router, private activatedRoute: ActivatedRoute, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.idRequest = params['idRequest'];
        });

        this.carregaLista();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    ExibirEsconderUpload() {
        this.isShow = !this.isShow;
    }

    carregaLista(): void {
        this.isLoadPanelVisible = true;
        this.itemService.clienteListItems(this.idRequest).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
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

    editar(e, data) {
        const idItem: number = data.row.data.idItem;
        this.router.navigate(['clienteitem'], { queryParams: { idItem: idItem, idRequest : this.idRequest } } );
    }

    ativar(e, data): void {
        this.idAtivacao  = data.row.data.idItem;
        this.isPopupConfimarAtivarVisible = true;
    }

    novoItem() {
        this.router.navigate(['clienteitem'], { queryParams: { 'idRequest' : this.idRequest } });
    }

    onCellPrepared(e) {
        if (e.rowType === 'data' && e.column.dataField !== 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.flAtivo) {
                ele.style.color = 'black';
            } else {
                ele.style.color = 'gray';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.idStatusItem === 1) {
                ele.firstElementChild.children[0].style.display = 'none';
                ele.firstElementChild.children[1].style.display = 'block';
            } else {
                ele.firstElementChild.children[0].style.display = 'block';
                ele.firstElementChild.children[1].style.display = 'none';
            }
        }

    }

    statusTexto(rowData) {

        if (rowData.idStatusItem === 1) {
            return 'Inicial';
        } else if (rowData.idStatusItem === 8)  {
            return 'Finalizado';
        } else {
            return 'Em Elaboração';
        }
    }

    descricaoTexto(rowData) {
        let retorno = '';
        if (rowData.dsCurta !== null && rowData.dsCurta !== undefined) {
            if (rowData.dsCurta.length > 20) {
                retorno = rowData.dsCurta.slice(0, 20) + '...';
            } else {
                retorno = rowData.dsCurta;
            }
        }
        return retorno;
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




fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.btnUploadNaoVisivel = this.fileData !== null && this.fileData !== undefined;
    if (this.btnUploadNaoVisivel) {
        this.filePath = this.fileData.name;
    }
}



onCancelUpload() {
    this.fileData = null;
    this.filePath = '';
    this.btnUploadNaoVisivel = false;
    this.myInputVariable.nativeElement.value = '';
}

onUpload() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('idRequest', this.idRequest.toString());
    formData.append('idUsuario', this.idUsuario.toString());

        this.isLoadPanelVisible = true;
      this.itemService.carregarEntradaItens(formData).pipe(takeUntil(this.destroy$)).subscribe((res: ErroImportacao[]) => {
        this.isLoadPanelVisible = false;

        this.fileData = null;
        this.filePath = '';
        this.btnUploadNaoVisivel = false;
        this.myInputVariable.nativeElement.value = '';

        if (res !== null && res.length > 0) {
            this.errosImportacao = res;
            this.isPopupErrosImportacaoVisible = true;
        }

        this.carregaLista();
    },
    error => {
        this.errorHandler(error);
    });

}

fecharErros() {
    this.isPopupErrosImportacaoVisible = false;
}

downloadExemplo() {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = '../../../assets/templates/exemplo.xlsx';
    link.download = 'exemplo.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

}
