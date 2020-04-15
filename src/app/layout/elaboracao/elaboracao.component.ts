import { Component, Input , OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AnexoItem } from '../../shared/models/anexoItem.model';
import { AnexoItemService } from '../../shared/services/anexoItem.service';
import { Nesh } from '../../shared/models/nesh.model';
import { NeshService } from '../../shared/services/nesh.service';
import { StatusItem } from '../../shared/models/statusItem.model';
import { NveService } from '../../shared/services/nve.service';
import { ExTarifService } from '../../shared/services/exTarif.service';
import { TratAdmService } from '../../shared/services/tratAdm.service';
import { ItemService } from '../../shared/services/item.service';
import { ElaboracaoService } from '../../shared/services/elaboracao.service';
import { EscopoAnaliseService } from '../../shared/services/escopoAnalise.service';
import { EscopoAnalise } from '../../shared/models/escopoAnalise.model';
import { Elaboracao, ElaboracaoToDb } from '../../shared/models/elaboracao.model';
import { Nve, NveElaboracao, NveElaboracaoToDb } from '../../shared/models/nve.model';
import { ExTarif, ExTarifElaboracao, ExTarifElaboracaoToDb } from '../../shared/models/exTarif.model';
import { TratAdm, TratAdmElaboracao, TratAdmElaboracaoToDb } from '../../shared/models/tratAdm.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Mensagem, MensagemToDb } from 'src/app/shared/models/mensagem.model';
import { MensagemService } from '../../shared/services/mensagem.service';
import { Item } from 'src/app/shared/models/item.model';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

enum OrigemMesagemEnum {
    Elaborador = 1,
    Cliente,
    Revisor
}

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
    selector: 'app-elaboracao',
    templateUrl: './elaboracao.component.html',
    styleUrls: ['./elaboracao.component.scss'],
    animations: [routerTransition()],
    providers: [ElaboracaoService, NveService]
})

export class ElaboracaoComponent implements OnInit {
    @ViewChild('controle_erro_pdm', {read: ElementRef, static: false}) controle_erro_pdm: ElementRef;
    @Input() idItem: number;
    elaboracao: Elaboracao;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    acaoElabRev: string;
    isPopupVisibleLegislacao = false;
    isPopupVisibleAnexos = false;
    NveSelecionaveis: NveElaboracao[];
    NveSelectedRows: number[];
    isPopupVisibleSelecaoNVE: boolean;

    TratAdmSelecionaveis: TratAdmElaboracao[];
    TratAdmSelectedRows: number[];
    isPopupVisibleSelecaoTratAdm: boolean;

    ExTarifSelecionaveis: ExTarifElaboracao[];
    ExTarifSelectedRows: number[];
    isPopupVisibleSelecaoExTarif: boolean;

    listaNve: Nve[];
    listaTratAdm: TratAdm[];
    listaExTarif: ExTarif[];

    legislacao: Nesh;
    anexosItem: AnexoItem[];
    status: StatusItem[];

    idStatusItem: number;
    isMensagemVisible = false;
    statusEnabled = false;

    isPopupVisibleMensagens = false;

    mensagens: Mensagem[];

    escoposAnalise: EscopoAnalise[];

    utuilizaEscopoNVE = false;
    utuilizaEscopoExTarifario = false;
    utuilizaEscopoTratamentoAdministrativo = false;
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;

    PdmObrigatorio = false;

    isReadOnly = false;
    habilitaMudancaStatus = true;

    item: Item;

    constructor(private escopoAnaliseService: EscopoAnaliseService, private mensagemService: MensagemService, private itemService: ItemService, private anexoItemService: AnexoItemService, private neshService: NeshService, private elaboracaoService: ElaboracaoService, private nveService: NveService, private exTarifService: ExTarifService, private tratAdmService: TratAdmService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }

    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idItem = params['idItem'];
        });

        this.carregaLista();
        this.carregaElaboracao();
        this.carregaListaNVE();
        this.carregaListaExTarif();
        this.carregaListaTratAdm();
        this.carregaMensagens();
        this.carregaItem();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
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

    obtemLegislacao() {
        this.isLoadPanelVisible = true;
        this.neshService.getNeshByNCM(this.elaboracao.cdNCM).subscribe((res: Nesh) => {
            this.isLoadPanelVisible = false;
            if (res !== null) {
                this.legislacao = res;
            } else {
                this.legislacao = new Nesh();
            }
        },
        error => {
            this.errorHandler(error);
        });
    }

    carregaItem(): void {
        this.isLoadPanelVisible = true;
            this.itemService.getItem(this.idItem).subscribe((res: Item) => {
                this.item = res;
                this.isReadOnly = this.item.idStatusItem !== StatusItemEnum.Elaboracao
                                    ||
                                    (this.item.idStatusItem === StatusItemEnum.Elaboracao && this.item.idUsuarioElaborador !== this.idUsuario);
                this.habilitaMudancaStatus = this.item.idStatusItem !== StatusItemEnum.Finalizado
                                             && (this.item.idStatusItem === StatusItemEnum.Elaboracao && this.item.idUsuarioElaborador === this.idUsuario);
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
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

    carregaElaboracao(): void {
        this.isLoadPanelVisible = true;
        this.elaboracaoService.getElaboracao(this.idItem).subscribe((res: Elaboracao) => {
            this.isLoadPanelVisible = false;

            if (res.idStatusItem === StatusItemEnum.Revisao ) {
                this.acaoElabRev = 'Revisão';
            } else {
                this.acaoElabRev = 'Elaboração';
            }

            this.elaboracao = res;
            this.carregaEscopoAnalise();
            this.montaListaStatus();
            this.obtemLegislacao();
        },
        error => {
            this.errorHandler(error);
        });

    }

    carregaMensagens(): void {
        this.isLoadPanelVisible = true;
        this.mensagemService.listMensagens(this.idItem).subscribe((res: Mensagem[]) => {
            this.isLoadPanelVisible = false;
            this.mensagens = res;
        },
        error => {
            this.errorHandler(error);
        });
    }

    montaListaStatus() {
        this.status = [];
        if (this.elaboracao.idStatusItem === StatusItemEnum.Elaboracao
            ||
            this.elaboracao.idStatusItem === StatusItemEnum.AnaliseNegada
            ||
            this.elaboracao.idStatusItem === StatusItemEnum.RespostaCliente) {
            const st1 = new StatusItem();
            st1.idStatusItem = StatusItemEnum.Revisao;
            st1.dsStatusItem = 'Revisão';
            this.status.push(st1);

            const st2 = new StatusItem();
            st2.idStatusItem = StatusItemEnum.PendenteCliente;
            st2.dsStatusItem = 'Pendente Cliente';
            this.status.push(st2);
        } else if (this.elaboracao.idStatusItem === StatusItemEnum.Revisao || this.elaboracao.idStatusItem === StatusItemEnum.RespostaElaborador) {
            const st1 = new StatusItem();
            st1.idStatusItem = StatusItemEnum.Finalizado;
            st1.dsStatusItem = 'Finalizado';
            this.status.push(st1);

            const st2 = new StatusItem();
            st2.idStatusItem = StatusItemEnum.Elaboracao;
            st2.dsStatusItem = 'Elaboração';
            this.status.push(st2);
        } else {
            const st = new StatusItem();
            st.idStatusItem = this.elaboracao.idStatusItem;

            if (this.elaboracao.idStatusItem === StatusItemEnum.Inicial) {
                st.dsStatusItem = 'Inicial';
            } else if (this.elaboracao.idStatusItem === StatusItemEnum.PendenteCliente) {
                st.dsStatusItem = 'Pendente com Cliente';
            } else if (this.elaboracao.idStatusItem === StatusItemEnum.Cancelado) {
                st.dsStatusItem = 'Cencelado';
            } else if (this.elaboracao.idStatusItem === StatusItemEnum.Finalizado) {
                st.dsStatusItem = 'Finalizado';
            }
            this.status.push(st);

            this.idStatusItem = this.elaboracao.idStatusItem;
            this.statusEnabled = true;
        }
    }

    onValueChanged (e) {

        if (e.value !== undefined) {
            const idStatusItem = e.value;

            this.isMensagemVisible = true;

            if ((
                (
                 this.elaboracao.idStatusItem === StatusItemEnum.Elaboracao || this.elaboracao.idStatusItem === StatusItemEnum.AnaliseNegada
                 ||
                 this.elaboracao.idStatusItem === StatusItemEnum.RespostaElaborador || this.elaboracao.idStatusItem === StatusItemEnum.RespostaCliente) && idStatusItem === StatusItemEnum.PendenteCliente
                )
                ||
                (this.elaboracao.idStatusItem === StatusItemEnum.Revisao || this.elaboracao.idStatusItem === StatusItemEnum.RespostaElaborador)
                &&
                idStatusItem === StatusItemEnum.Elaboracao
                ) {
                this.isMensagemVisible = true;
            } else {
                this.isMensagemVisible = false;
            }
        }
    }

    dataFormatada(rowData) {
        const data = rowData.dtCriacao.toString();
        const strOnlyDate = data.substring(0, data.indexOf('T'));
        const hora = data.substring(data.indexOf('T') + 1, data.indexOf('.') );
        const arrData = strOnlyDate.split('-');
        const retorno = arrData[2] + '/' + arrData[1] + '/' + arrData[0] + ' ' + hora;
        return retorno; // arrData[2] + '/' + arrData[1] + '/' + arrData[0];
    }

    carregaLista(): void {
        // tslint:disable-next-line:whitespace
        this.isLoadPanelVisible = true;
        this.anexoItemService.listAnexosItem(this.idItem, '').pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.anexosItem = data;
        },
        error => {
            this.errorHandler(error);
        });
    }


    statusTexto(rowData) {
        if (rowData.flAtivo) {
            return 'Ativo';
        } else {
            return 'Inativo';
        }
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        this.router.navigate(['visaogerencial']);
    }

    validaPDM(): boolean {
        let retorno = false;


        if (this.idStatusItem === StatusItemEnum.Revisao && this.elaboracao.idStatusItem === StatusItemEnum.Elaboracao && (this.elaboracao.dsPDM === '' || this.elaboracao.dsPDM === undefined || this.elaboracao.dsPDM === null) ) {
            if (this.controle_erro_pdm !== undefined) {
                this.controle_erro_pdm.nativeElement.style.padding = '3px';
                this.controle_erro_pdm.nativeElement.style.border = '1px solid #D9534F';
            }

            this.PdmObrigatorio = true;
            retorno = false;
        } else {
            this.limpaValidacaoPDM();
            retorno = true;
        }
        return retorno;
    }

    limpaValidacaoPDM() {
        if (this.PdmObrigatorio === true) {
            if (this.controle_erro_pdm !== undefined) {
                this.controle_erro_pdm.nativeElement.style.padding = '0px';
                this.controle_erro_pdm.nativeElement.style.border = '0px';
            }


            this.PdmObrigatorio = false;
        }
    }

    onFormSubmit = function(e) {
        e.preventDefault();

        const flValidacaoPDM = this.validaPDM();

        if (!flValidacaoPDM) {
            return;
        }

        const elaboracaoToDb: ElaboracaoToDb = new ElaboracaoToDb();

        if (this.elaboracao.idPDM != null && this.elaboracao.idPDM !== undefined) {
            elaboracaoToDb.IdPDM = this.elaboracao.idPDM;
            elaboracaoToDb.IdItem = this.elaboracao.idItem;

        } else {
            elaboracaoToDb.IdItem = this.idItem;
        }

        elaboracaoToDb.DsPDM = this.elaboracao.dsPDM;
        elaboracaoToDb.IdNCM = this.elaboracao.idNCM;

        this.elaboracaoService.saveElaboracao(elaboracaoToDb).subscribe(retoroSalvar => {

            if (this.elaboracao.idStatusItem !== this.idStatusItem) {

                if (this.isMensagemVisible) {
                    const mensagemToDb = this.montaMensagemToDB();
                    this.isLoadPanelVisible = true;
                    this.mensagemService.saveMensagem(mensagemToDb).subscribe((res: Mensagem[]) => {
                        this.isLoadPanelVisible = false;
                        this.definirStatusItem();
                    },
                    error => {
                        this.errorHandler(error);
                    });
                } else {
                    this.definirStatusItem();
                }

            } else {
                this.isPopupVisible = true;
            }
        },
        error => {
            this.errorHandler(error);
        });
    };

    definirStatusItem(): void {
        this.isLoadPanelVisible = true;
        this.itemService.definirStatusItem(this.idItem, this.idStatusItem, this.idUsuario).subscribe((res1: Item) => {
            this.isLoadPanelVisible = false;
            this.isPopupVisible = true;
        },
        error => {
            this.errorHandler(error);
        });
    }

    montaMensagemToDB(): MensagemToDb {
        const msg = new MensagemToDb();

        let idOrigemMensagem: number;
        let idDestinoMensagem: number;
        if (this.idStatusItem === StatusItemEnum.PendenteCliente) {
            idOrigemMensagem = OrigemMesagemEnum.Elaborador;
            idDestinoMensagem = OrigemMesagemEnum.Cliente;
        } else if (this.idStatusItem === StatusItemEnum.Elaboracao) {
            idOrigemMensagem = OrigemMesagemEnum.Revisor;
            idDestinoMensagem = OrigemMesagemEnum.Elaborador;
        }

        msg.IdItem = this.idItem;
        msg.DsMensagemElaboracao = this.elaboracao.dsMensagem;
        msg.IdOrigemMensagem = idOrigemMensagem;
        msg.IdDestinoMensagem = idDestinoMensagem;
        msg.FlVisualizado = false;
        msg.FlAtivo = true;
        msg.DtCriacao = new Date();
        msg.IdUsuario = this.idUsuario;

        return msg;
    }

    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    popup_hidden(e): void {
        this.router.navigate(['visaogerencial']);
    }

    abreSelecaoNVE(): void {
        this.isLoadPanelVisible = true;
        this.nveService.ListarNVEDaElaboracao(this.elaboracao.idNCM, this.idItem).subscribe((res: NveElaboracao[]) => {
            this.isLoadPanelVisible = false;
            this.NveSelecionaveis = res;

            this.NveSelectedRows = [];

            if (res !== null && res !== undefined) {
            for (let i = 0; i < res.length; i++) {
                if (res[i].flUtilizado) {
                    this.NveSelectedRows.push(res[i].idNVE);
                }
            }
            }

            this.isPopupVisibleSelecaoNVE = true;
        },
        error => {
            this.errorHandler(error);
        });
    }

    descricaoNome(rowData) {
        const tamanho = rowData.nmAnexoItem.length;
        const posicao = rowData.nmAnexoItem.indexOf('_');
        const nome = rowData.nmAnexoItem.substring(posicao + 1, tamanho);
        return nome;
    }

    abreSelecaoExTarif(): void {
        this.isLoadPanelVisible = true;
        this.exTarifService.ListarExTarifDaElaboracao(this.elaboracao.idNCM, this.idItem).subscribe((res: ExTarifElaboracao[]) => {
            this.isLoadPanelVisible = false;
            this.ExTarifSelecionaveis = res;

            this.ExTarifSelectedRows = [];

            if (res !== null && res !== undefined) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].flUtilizado) {
                        this.ExTarifSelectedRows.push(res[i].idExTarif);
                    }
                }
            }

            this.isPopupVisibleSelecaoExTarif = true;
        },
        error => {
            this.errorHandler(error);
        });
    }

    abreSelecaoTratAdm(): void {
        this.isLoadPanelVisible = true;
        this.tratAdmService.ListarTratAdmDaElaboracao(this.elaboracao.idNCM, this.idItem).subscribe((res: TratAdmElaboracao[]) => {
            this.isLoadPanelVisible = false;
            this.TratAdmSelecionaveis = res;

            this.TratAdmSelectedRows = [];

            if (res !== null && res !== undefined) {
            for (let i = 0; i < res.length; i++) {
                if (res[i].flUtilizado) {
                    this.TratAdmSelectedRows.push(res[i].idTratamentoAdministrativo);
                }
            }
            }

            this.isPopupVisibleSelecaoTratAdm = true;
        },
        error => {
            this.errorHandler(error);
        });
    }

    selecionarNVEs(): void {
        const input = new NveElaboracaoToDb();
        input.IdItem = this.idItem;
        input.NvesSelecionadas = this.NveSelectedRows;

        this.isLoadPanelVisible = true;
        this.nveService.salvarNveElaboracao(input).subscribe((res: NveElaboracaoToDb) => {
            this.nveService.ListarNveDoItem(this.idItem).subscribe((res1: Nve[]) => {
                this.isLoadPanelVisible = false;
                this.listaNve = res1;
                this.isPopupVisibleSelecaoNVE = false;
            },
            error => {
                this.errorHandler(error);
            });
        },
        error => {
            this.errorHandler(error);
        });
    }

    selecionarExTarifs(): void {
        const input = new ExTarifElaboracaoToDb();
        input.IdItem = this.idItem;
        input.ExTarifSelecionadas = this.ExTarifSelectedRows;

        this.isLoadPanelVisible = true;
        this.exTarifService.salvarExTarifElaboracao(input).subscribe((res: ExTarifElaboracaoToDb) => {
            this.exTarifService.ListarExTarifDoItem(this.idItem).subscribe((res1: ExTarif[]) => {
                this.listaExTarif = res1;
                this.isPopupVisibleSelecaoExTarif = false;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        },
        error => {
            this.errorHandler(error);
        });
    }

    selecionarTratAdms(): void {
        const input = new TratAdmElaboracaoToDb();
        input.IdItem = this.idItem;
        input.TratAdmSelecionadas = this.TratAdmSelectedRows;

        this.isLoadPanelVisible = true;
        this.tratAdmService.salvarTratAdmElaboracao(input).subscribe((res: TratAdmElaboracaoToDb) => {
            this.tratAdmService.ListarTratAdmDoItem(this.idItem).subscribe((res: TratAdm[]) => {
                this.listaTratAdm = res;
                this.isPopupVisibleSelecaoTratAdm = false;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        },
        error => {
            this.errorHandler(error);
        });
    }

    cancelarSelecaoNVes(): void {
        this.isPopupVisibleSelecaoNVE = false;
    }

    cancelarSelecaoExTarifs(): void {
        this.isPopupVisibleSelecaoExTarif = false;
    }

    cancelarSelecaoTratAdms(): void {
        this.isPopupVisibleSelecaoTratAdm = false;
    }

    abrirFecharLegislacao() {
        this.isPopupVisibleLegislacao = !this.isPopupVisibleLegislacao;
    }

    abrirFecharAnexos() {
        this.isPopupVisibleAnexos = !this.isPopupVisibleAnexos;
    }

    abrirFecharMensagens() {
        this.isPopupVisibleMensagens = !this.isPopupVisibleMensagens;
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

    varificaElaboracaoParaRevisao(e) {
        return true;
        /*
        if (this.idStatusItem === StatusItemEnum.Elaboracao && this.elaboracao.idStatusItem === StatusItemEnum.Revisao) {
            return false;
        } else {
            return true;
        }
        */
    }

    onCellPrepared(e) {
        e.component.expandAll(-1);
        /*
        if (e.rowType === 'data' && e.column.dataField !== 'nmOrigemMensagem' && e.column.dataField !== 'dtCriacao' && e.column.dataField !== 'nmUsuario' && e.column.dataField !== 'dsMensagemElaboracao') {
            const ele = e.cellElement;
            if (e.data.flVisualizado !== true) {
                ele.firstElementChild.onclick = function() { alert(e.data.idMensagemElaboracao); };
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'flAtivo') {
            const ele = e.cellElement;
            if (e.data.idOrigemMensagem !== 1) {
                ele.firstElementChild.style.display = 'none';
            } else {
                let classe = 'fa fa-envelope';
                if (e.data.flVisualizado === true) {
                    classe = 'fa fa-envelope-open';
                } else {
                    classe = 'fa fa-envelope';
                }
            }
        }
        */
    }

}

