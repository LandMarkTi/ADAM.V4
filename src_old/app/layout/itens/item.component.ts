import { Component, Input , OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ItemService } from '../../shared/services/item.service';
import { AnexoItemService } from '../../shared/services/anexoItem.service';
import { NcmService } from '../../shared/services/ncm.service';
import { Item, ItemToDb, StatusItem } from '../../shared/models/item.model';
import { AnexoItem } from '../../shared/models/anexoItem.model';
import { Ncm } from '../../shared/models/ncm.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    animations: [routerTransition()],
    providers: [ItemService]
})
export class ItemComponent implements OnInit {
    @ViewChild('myInput', {read: ElementRef, static: false}) private myInputVariable: ElementRef;

    constructor(private itemService: ItemService, private anexoItemService: AnexoItemService, private ncmService: NcmService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    @Input() idRequest: number;
    @Input() idItem: number;
    item: Item;
    isPopupVisible = false;
    isPopupErroVisible = false;
    isPopupVisibleArquivosAnexos = false;
    msgErroValidacao = '';
    somenteLeitura: boolean;
    fileData: File = null;
    fileToUpload: File = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    anexosItem: AnexoItem[];
    baseUrl = environment.baseUrl;
    isPopupVisibleUpload = false;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;
    btnUploadNaoVisivel = false;
    filePath = '';

    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idRequest = params['idRequest'];
            console.log(this.idRequest);

            this.idItem = params['idItem'];
            this.somenteLeitura = params['sl'] === 'true';
        });

        this.carregaItem();
        this.carregaLista();

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

    onUpload() {
        const formData = new FormData();
        formData.append('file', this.fileData);
        formData.append('idItem', this.idItem.toString());
        formData.append('idUsuario', this.idUsuario.toString());
        this.isLoadPanelVisible = true;
          this.anexoItemService.uploadArquivoDoItem(formData).pipe(takeUntil(this.destroy$)).subscribe((res: AnexoItem) => {
            this.isLoadPanelVisible = false;

            if (res !== null && res.idAnexoItem > 0) {
                this.fileData = null;
                this.filePath = '';
                this.isPopupVisibleUpload = true;
                this.btnUploadNaoVisivel = false;
                this.myInputVariable.nativeElement.value = '';
            }

            this.carregaLista();
        },
        error => {
            this.errorHandler(error);
        });
    }

    carregaLista(): void {
        this.isLoadPanelVisible = true;
        if (this.idItem !== undefined) {
        // tslint:disable-next-line:whitespace
        this.anexoItemService.listAnexosItem(this.idItem,'').pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.anexosItem = data;
        },
        error => {
            this.errorHandler(error);
        });
        }
    }

    carregaItem(): void {
        this.isLoadPanelVisible = true;
        if (this.idItem !== undefined) {
            this.itemService.getItem(this.idItem).subscribe((res: Item) => {
                this.item = res;
                this.isLoadPanelVisible = false;
            });
        } else {
            const idStatusPendente = 1;
            this.item = new Item();
            this.itemService.obtemStatusItem(idStatusPendente).subscribe((res: StatusItem) => {
                this.item.idStatusItem = res.idStatusItem;
                this.item.dsStatusItem = res.dsStatusItem;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        }
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        if (!this.somenteLeitura) {
            this.router.navigate(['itens'], { queryParams: { 'idRequest' : this.idRequest }});
        } else {
            this.router.navigate(['visaogerencial']);
        }
    }

    descricaoNome(rowData) {
        const tamanho = rowData.nmAnexoItem.length;
        const posicao = rowData.nmAnexoItem.indexOf('_');
        const nome = rowData.nmAnexoItem.substring(posicao + 1, tamanho);
        return nome;
    }

    onFormSubmit = function(e) {

        const itemToDb: ItemToDb = new ItemToDb();

        let inputIdItem = '';

        if (this.item.idItem != null && this.item.idItem !== undefined) {
            itemToDb.IdItem = this.item.idItem;
            itemToDb.IdRequest = this.item.idRequest;
            itemToDb.IdUsuarioUltimaModificacao = this.idUsuario;
            itemToDb.DtCriacao = new Date();
            inputIdItem = this.item.idItem.toString();
            itemToDb.IdUsuarioCriacao = this.item.idUsuarioCriacao;
            itemToDb.DtInicioEtapa = this.item.dtInicioEtapa;
        } else {
            itemToDb.IdUsuarioCriacao = this.idUsuario;
            itemToDb.IdRequest = this.idRequest;
            itemToDb.DtCriacao = this.item.dtCriacao;
        }

        itemToDb.NrSKU = this.item.nrSKU;
        itemToDb.DsCurta = this.item.dsCurta;
        itemToDb.DsCompleta = this.item.dsCompleta;
        itemToDb.IdNCM = this.item.idNCM;
        itemToDb.IdUsuarioElaborador = this.item.idUsuarioElaborador;
        itemToDb.IdusuarioRevisor = this.item.idusuarioRevisor;
        itemToDb.FlAtivo = true;
        itemToDb.IdStatusItem = this.item.idStatusItem;

        this.isLoadPanelVisible = true;

        this.itemService.verificarSKUInexistente(this.idRequest, inputIdItem, this.item.nrSKU)
        .subscribe(retornoSKU => {
            this.isLoadPanelVisible = false;
            if (!retornoSKU) {
              this.msgErroValidacao = 'SKU já utilizado.';
              this.isPopupErroVisible = true;
              return false;
            } else {
                if (this.item.cdNCM.length < 8) {
                    this.msgErroValidacao = 'Código NCM inválido.';
                    this.isPopupErroVisible = true;
                    return false;
                } else {
                    this.isLoadPanelVisible = true;
                    this.ncmService.getNcmByCode(this.item.cdNCM).subscribe((res: Ncm) => {
                        this.isLoadPanelVisible = false;
                        if (res === undefined || res === null) {
                            this.msgErroValidacao = 'Código NCM não encontrado.';
                            this.isPopupErroVisible = true;
                            return false;
                        } else {
                            if ((this.item.dsCurta === null || this.item.dsCurta === undefined || this.item.dsCurta.trim() === '') && (this.item.dsCompleta === null || this.item.dsCompleta === undefined || this.item.dsCompleta.trim() === '')) {
                                this.msgErroValidacao = 'Pelo menos uma descrição (curta ou completa) deve ser informada.';
                                this.isPopupErroVisible = true;
                                return false;
                            } else {
                                this.item.idNCM = res.idNCM;
                                this.item.cdNCM = res.cdNCM;
                                this.item.dsNCM = res.dsNCM;
                                this.isLoadPanelVisible = true;
                                this.itemService.saveItem(itemToDb).subscribe(retoroSalvar => {
                                    this.isLoadPanelVisible = false;
                                    this.isPopupVisible = true;
                                },
                                error => {
                                    this.errorHandler(error);
                                });
                            }
                        }
                    },
                    error => {
                        this.errorHandler(error);
                    });
                }
            }
        },
        error => {
            this.errorHandler(error);
        });
        e.preventDefault();
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
        let nome = data.data.nmAnexoItem;
        const posicao =  nome.lastIndexOf('.');
        const extensao = nome.substring(posicao, nome.length).toLocaleLowerCase();
        this.isLoadPanelVisible = true;

        this.anexoItemService.DownloadFile(nome).subscribe(
          data => {
            switch (data.type) {
              case HttpEventType.Response:
                const downloadedFile = new Blob([data.body], { type: data.body.type });
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);

                const posicaoUnderline =  nome.indexOf('_');
                if (posicaoUnderline > -1) {
                    nome = nome.substring(posicaoUnderline + 1);
                }

                a.download = nome;
                a.href = URL.createObjectURL(downloadedFile);
                a.target = '_blank';
                this.isLoadPanelVisible = false;
                a.click();
                document.body.removeChild(a);
                break;
            }
          },
          error => {
            console.log(error);
          }
        );
      }

    popup_hidden(e): void {
        this.router.navigate(['itens'], { queryParams: { 'idRequest' : this.idRequest }});
    }
}

