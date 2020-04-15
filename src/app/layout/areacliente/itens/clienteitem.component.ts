import { Component, Input , OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ItemService } from '../../../shared/services/item.service';
import { AnexoItemService } from '../../../shared/services/anexoItem.service';
import { NcmService } from '../../../shared/services/ncm.service';
import { Item, ItemToDb, StatusItem } from '../../../shared/models/item.model';
import { AnexoItem, AnexoItemToDb } from '../../../shared/models/anexoItem.model';
import { Ncm } from '../../../shared/models/ncm.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { filter, pairwise } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { saveAs } from 'file-saver';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { EscopoAnaliseService } from 'src/app/shared/services/escopoAnalise.service';
import { EscopoAnalise } from 'src/app/shared/models/escopoAnalise.model';
import { Elaboracao, ElaboracaoToDb } from 'src/app/shared/models/elaboracao.model';
import { ElaboracaoService } from 'src/app/shared/services/elaboracao.service';
import { Nve, NveElaboracao, NveElaboracaoToDb } from 'src/app/shared/models/nve.model';
import { ExTarif, ExTarifElaboracao, ExTarifElaboracaoToDb } from 'src/app/shared/models/exTarif.model';
import { TratAdm, TratAdmElaboracao, TratAdmElaboracaoToDb } from 'src/app/shared/models/tratAdm.model';
import { NveService } from 'src/app/shared/services/nve.service';
import { ExTarifService } from 'src/app/shared/services/exTarif.service';
import { TratAdmService } from 'src/app/shared/services/tratAdm.service';

enum  StatusItemEnum {
    Inicial = 1,
    Elaboracao,
    Revisao,
    PendenteCliente,
    RespostaCliente,
    RespostaElaborador,
    AnaliseNegada,
    Finalizado,
    Cancelado
}

enum EscopoAnaliseEnum {
    NVE = 1,
    ExTarifario = 2,
    TratamentoAdministrativo
}

@Component({
    selector: 'app-item',
    templateUrl: './clienteitem.component.html',
    styleUrls: ['./clienteitem.component.scss'],
    animations: [routerTransition()],
    providers: [ItemService]
})
export class ClienteItemComponent implements OnInit {
    @ViewChild('myInput', {read: ElementRef, static: false}) private myInputVariable: ElementRef;

    constructor(private elaboracaoService: ElaboracaoService, private escopoAnaliseService: EscopoAnaliseService, private itemService: ItemService, private anexoItemService: AnexoItemService, private ncmService: NcmService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService,  private nveService: NveService, private exTarifService: ExTarifService, private tratAdmService: TratAdmService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (this.isInternalUser) {
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
    btnCarregarAtivo = false;
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
    escoposAnalise: EscopoAnalise[];
    utuilizaEscopoNVE = false;
    utuilizaEscopoExTarifario = false;
    utuilizaEscopoTratamentoAdministrativo = false;
    elaboracao: Elaboracao;
    listaNve: Nve[];
    listaTratAdm: TratAdm[];
    listaExTarif: ExTarif[];
    isItemFinalizado = false;
    isNaoFianlizado: boolean;
    isReadOnly = false;

    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idRequest = params['idRequest'];
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

                if (this.item.idStatusItem === StatusItemEnum.Finalizado) {
                    this.isItemFinalizado = true;
                    this.carregaElaboracao();
                    this.carregaListaNVE();
                    this.carregaListaExTarif();
                    this.carregaListaTratAdm();
                } else {
                    this.isNaoFianlizado = true;
                }
                this.isReadOnly = this.item.idStatusItem !== StatusItemEnum.Inicial ;
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
            this.router.navigate(['clienteitens'], { queryParams: { 'idRequest' : this.idRequest }});
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

    carregaElaboracao(): void {
        this.isLoadPanelVisible = true;
        this.elaboracaoService.getElaboracao(this.idItem).subscribe((res: Elaboracao) => {
            this.isLoadPanelVisible = false;
            this.elaboracao = res;
            this.carregaEscopoAnalise();
        },
        error => {
            this.errorHandler(error);
        });

    }

    carregaEscopoAnalise() {
        this.isLoadPanelVisible = true;
        this.escopoAnaliseService.ListarSomeneteEscoposDoRequest(this.elaboracao.idRequest).subscribe((res: EscopoAnalise[]) => {
            this.isLoadPanelVisible = false;
            this.escoposAnalise = res;
            this.configuraEscopos();
        },
        error => {
            this.errorHandler(error);
        });
    }

    configuraEscopos() {
        for (let i = 0; i < this.escoposAnalise.length; i++) {

            if (this.escoposAnalise[i].idEscopoAnalise === EscopoAnaliseEnum.NVE) {
                this.utuilizaEscopoNVE = true;
            } else if (this.escoposAnalise[i].idEscopoAnalise === EscopoAnaliseEnum.ExTarifario) {
                this.utuilizaEscopoExTarifario = true;
            } else if (this.escoposAnalise[i].idEscopoAnalise === EscopoAnaliseEnum.TratamentoAdministrativo) {
                this.utuilizaEscopoTratamentoAdministrativo = true;
            }
        }
    }

    carregaListaNVE(): void {
        this.isLoadPanelVisible = true;
        this.nveService.ListarNveDoItem(this.idItem).subscribe((res: Nve[]) => {
            this.isLoadPanelVisible = false;
            this.listaNve = res;
        },
        error => {
            this.errorHandler(error);
        });
    }

    carregaListaExTarif(): void {
        this.isLoadPanelVisible = true;
        this.exTarifService.ListarExTarifDoItem(this.idItem).subscribe((res: ExTarif[]) => {
            this.isLoadPanelVisible = false;
            this.listaExTarif = res;
        },
        error => {
            this.errorHandler(error);
        });
    }

    carregaListaTratAdm(): void {
        this.isLoadPanelVisible = true;
        this.tratAdmService.ListarTratAdmDoItem(this.idItem).subscribe((res: TratAdm[]) => {
            this.isLoadPanelVisible = false;
            this.listaTratAdm = res;
        },
        error => {
            this.errorHandler(error);
        });
    }


    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharSucessoUpload(): void {
        this.isPopupVisibleUpload = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    download(e, data): void {
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
        this.router.navigate(['clienteitens'], { queryParams: { 'idRequest' : this.idRequest }});
    }
}

