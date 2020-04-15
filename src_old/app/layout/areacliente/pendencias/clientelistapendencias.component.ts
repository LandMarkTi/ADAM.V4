import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { MensagemPendente } from '../../../shared/models/mensagemPendente.model';
import { MensagemService } from '../../../shared/services/mensagem.service';

@Component({
    selector: 'app-clientelistapendencias',
    templateUrl: './clientelistapendencias.component.html',
    styleUrls: ['./clientelistapendencias.component.scss'],
    animations: [routerTransition()],
    providers: [MensagemService]
})
export class ClienteListaPendenciasComponent implements OnInit {
    mensagenspendentes: MensagemPendente[];
    destroy$: Subject<boolean> = new Subject<boolean>();
    fileToUpload: File = null;
    fileData: File = null;
    previewUrl: any = null;
    uploadedFilePath: string = null;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    constructor(private mensagemService: MensagemService, private router: Router, private activatedRoute: ActivatedRoute, private autenticacaoService: AutenticacaoService) {
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

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    carregaLista(): void {
        this.isLoadPanelVisible = true;
        this.mensagemService.listarPendenciasCliente(this.idUsuario).pipe(takeUntil(this.destroy$)).subscribe((data: MensagemPendente[]) => {
            this.isLoadPanelVisible = false;
            this.mensagenspendentes = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    responder(e, data) {
        const idMensagemElaboracao: number = data.row.data.idMensagemElaboracao;
        this.router.navigate(['clienteresposta'], { queryParams: { idMensagemElaboracao: idMensagemElaboracao } } );
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
}
