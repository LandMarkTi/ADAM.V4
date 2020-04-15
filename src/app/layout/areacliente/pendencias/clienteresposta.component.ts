import { Component, Input , OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ItemService } from '../../../shared/services/item.service';
import { AnexoItemService } from '../../../shared/services/anexoItem.service';
import { MensagemService } from '../../../shared/services/mensagem.service';
import { NcmService } from '../../../shared/services/ncm.service';
import { Item, ItemToDb, StatusItem } from '../../../shared/models/item.model';
import { AnexoItem, AnexoItemToDb } from '../../../shared/models/anexoItem.model';
import { Mensagem } from '../../../shared/models/mensagem.model';
import { RespostaCliente, RespostaClienteToDb } from '../../../shared/models/respostaCliente.model';
import { Ncm } from '../../../shared/models/ncm.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { filter, pairwise } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { saveAs } from 'file-saver';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { DatePipe } from '@angular/common';
import { stringify } from 'querystring';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
    selector: 'app-clienteresposta',
    templateUrl: './clienteresposta.component.html',
    styleUrls: ['./clienteresposta.component.scss'],
    animations: [routerTransition()],
    providers: [ItemService, DatePipe]
})
export class ClienteRespostaComponent implements OnInit {

    // @ViewChild('myInput', {static: true}) myInputVariable: ElementRef;

    @ViewChild('myInput', {read: ElementRef, static: false}) private myInputVariable: ElementRef;

    // tslint:disable-next-line:max-line-length
    constructor(private datePipe: DatePipe, private itemService: ItemService, private mensagemService: MensagemService, private anexoItemService: AnexoItemService, private ncmService: NcmService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }


    @Input() idMensagemElaboracao: number;
    item: Item;
    historicoMensagens: Mensagem[];
    resposta = new RespostaClienteToDb();
    mensagemElaborador: Mensagem;
    isPopupVisible = false;
    isPopupErroVisible = false;
    isPopupVisibleArquivosAnexos = false;
    msgErroValidacao = '';
    somenteLeitura: boolean;
    fileData: File = null;
    btnUploadNaoVisivel = false;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    anexosItem: AnexoItem[];
    baseUrl = environment.baseUrl;
    isPopupVisibleUpload = false;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;
    isPopupHistoricoVisible = false;
    filePath = '';

    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idMensagemElaboracao = params['idMensagemElaboracao'];
            this.somenteLeitura = params['sl'] === 'true';
        });

        this.carregaItem();

    }

    carregaItem(): void {
        this.isLoadPanelVisible = true;

        this.itemService.obterItemPorIdMensagem(this.idMensagemElaboracao, this.idUsuario).subscribe((res: Item) => {
            this.item = res;
            this.carregaLista();
            this.obterMensagemResposta();
            this.obterRespostaDaMensagemElaboracao();
            this.isLoadPanelVisible = false;

            this.listAnexosItem();
        });
    }

    obterMensagemResposta() {
        try {
            this.isLoadPanelVisible = true;

            this.mensagemService.getMensagemParaCliente(this.idMensagemElaboracao, this.idUsuario).subscribe((res: Mensagem) => {
                this.mensagemElaborador = res;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        } catch (Error) {
            alert(Error.message);
        }

    }

    obterRespostaDaMensagemElaboracao() {
        this.isLoadPanelVisible = true;

        this.mensagemService.obterRespostaDaMensagemElaboracao(this.idUsuario, this.idMensagemElaboracao).subscribe((res: RespostaCliente) => {
            this.resposta.IdMensagemElaboracao = res.idMensagemElaboracao;
            this.resposta.IdUsuario = res.idUsuario;
            this.resposta.IdMensagemPai = res.idMensagemPai;
            this.resposta.IdItem = res.idItem;
            this.resposta.DsMensagemElaboracao = res.dsMensagemElaboracao;
            this.isLoadPanelVisible = false;
        });
    }

    listAnexosItem() {
        this.isLoadPanelVisible = true;

        let strIdMensagemElaboracao = '';

        if (this.resposta.IdMensagemElaboracao !== undefined && this.resposta.IdMensagemElaboracao !== null) {
            strIdMensagemElaboracao = this.resposta.IdMensagemElaboracao.toString();
        }

        this.anexoItemService.listAnexosItem(this.item.idItem, strIdMensagemElaboracao).subscribe((res: AnexoItem[]) => {
            this.anexosItem = res;
            this.isLoadPanelVisible = false;
        });
    }

    fecharHistoricoSucesso(): void {
        this.isPopupHistoricoVisible = false;
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    abrirFecharAnexos() {
        this.isPopupVisibleArquivosAnexos = !this.isPopupVisibleArquivosAnexos;
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

    updateNcmInfo(e) {
        if (e.value.length === 8) {
            this.isLoadPanelVisible = true;
            this.ncmService.getNcmByCode(e.value).subscribe((res: Ncm) => {
                this.isLoadPanelVisible = false;
                this.item.idNCM = res.idNCM;
                this.item.cdNCM = res.cdNCM;
                this.item.dsNCM = res.dsNCM;
            });
        } else {
            this.item.idNCM = null;
        }
    }

    onUpload(e) {
        e.preventDefault = true;
        const formData = new FormData();
        formData.append('file', this.fileData);
        formData.append('idItem', this.item.idItem.toString());
        formData.append('idUsuario', this.idUsuario.toString());

        if (this.resposta.IdMensagemElaboracao === null || this.resposta.IdMensagemElaboracao === undefined) {
            const respostaToDb = new RespostaClienteToDb();
            respostaToDb.IdItem = this.item.idItem;
            respostaToDb.IdMensagemPai = this.idMensagemElaboracao;
            respostaToDb.DsMensagemElaboracao = this.resposta.DsMensagemElaboracao;
            respostaToDb.IdUsuario = this.idUsuario;
            respostaToDb.FlRespondido = false;
            this.mensagemService.responderMensagemDoElaborador(respostaToDb).subscribe((res: RespostaCliente) => {
                this.resposta.IdMensagemElaboracao = res.idMensagemElaboracao;
                formData.append('idMensagemElaboracao', this.resposta.IdMensagemElaboracao.toString());

                this.isLoadPanelVisible = true;
                this.anexoItemService.uploadArquivoDoItem(formData).pipe(takeUntil(this.destroy$)).subscribe((res1: AnexoItem) => {
                    this.isLoadPanelVisible = false;

                    if (res1 !== null && res1.idAnexoItem > 0) {
                        this.fileData = null;
                        this.filePath = '';
                        this.isPopupVisibleUpload = true;
                        this.btnUploadNaoVisivel = false;
                        this.myInputVariable.nativeElement.value = '';
                        this.listAnexosItem();
                    }

                    this.carregaLista();

                },
                error => {
                    this.errorHandler(error);
                });

            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.isLoadPanelVisible = true;
            formData.append('idMensagemElaboracao', this.resposta.IdMensagemElaboracao.toString());
            this.anexoItemService.uploadArquivoDoItem(formData).pipe(takeUntil(this.destroy$)).subscribe((res: AnexoItem) => {
                this.isLoadPanelVisible = false;

                if (res !== null && res.idAnexoItem > 0) {
                    this.fileData = null;
                    this.filePath = '';
                    this.isPopupVisibleUpload = true;
                    this.btnUploadNaoVisivel = false;
                    this.myInputVariable.nativeElement.value = '';
                    this.listAnexosItem();
                }

                this.carregaLista();

            },
            error => {
                this.errorHandler(error);
            });
        }

        return;
    }

    dataFormatada(rowData) {
        const data = rowData.dtCriacao.toString();
        const strOnlyDate = data.substring(0, data.indexOf('T'));
        const hora = data.substring(data.indexOf('T') + 1, data.indexOf('.') );
        const arrData = strOnlyDate.split('-');
        const retorno = arrData[2] + '/' + arrData[1] + '/' + arrData[0] + ' ' + hora;
        return retorno; // arrData[2] + '/' + arrData[1] + '/' + arrData[0];
    }


    contentReady(e) {
        e.component.expandAll(-1);
    }

    carregaLista(): void {
        try {
            this.isLoadPanelVisible = true;
            // tslint:disable-next-line:whitespace
            // tslint:disable-next-line:max-line-length
            this.mensagemService.listarHistoricoMensagemItem(this.idUsuario , this.item.idItem).pipe(takeUntil(this.destroy$)).subscribe((data: Mensagem[]) => {
                this.isLoadPanelVisible = false;

                this.historicoMensagens = data;
            },
            error => {
                this.errorHandler(error);
            });
        } catch (Error) {
            alert(Error.message);
        }

    }

    abrirHistoricoMensagens(): void {
        this.isPopupHistoricoVisible = true;
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        if (!this.somenteLeitura) {
            this.router.navigate(['clientelistapendencias']);
        }
    }

    descricaoNome(rowData) {
        const tamanho = rowData.nmAnexoItem.length;
        const posicao = rowData.nmAnexoItem.indexOf('_');
        const nome = rowData.nmAnexoItem.substring(posicao + 1, tamanho);
        return nome;
    }

    onFormSubmit = function(e) {
        e.preventDefault();
        this.isLoadPanelVisible = true;

        const respostaToDb = new RespostaClienteToDb();

        if (this.resposta.IdMensagemElaboracao !== undefined && this.resposta.IdMensagemElaboracao !== null) {
            respostaToDb.IdMensagemElaboracao = this.resposta.IdMensagemElaboracao;
        }

        respostaToDb.IdItem = this.item.idItem;
        respostaToDb.IdMensagemPai = this.idMensagemElaboracao;
        respostaToDb.DsMensagemElaboracao = this.resposta.DsMensagemElaboracao;
        respostaToDb.IdUsuario = this.idUsuario;
        respostaToDb.FlRespondido = true;
        this.mensagemService.responderMensagemDoElaborador(respostaToDb).subscribe((res: RespostaCliente) => {
            this.resposta.IdMensgaemElaboracao = res.idMensagemElaboracao;
            this.isLoadPanelVisible = false;
            this.isPopupVisible = true;
        },
        error => {
            this.errorHandler(error);
        });
    };

    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharSucessoUpload(): void {
        this.isPopupVisibleUpload = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    download(e, data) {

    }

    popup_hidden(e): void {
        this.router.navigate(['clientelistapendencias']);
    }
}

