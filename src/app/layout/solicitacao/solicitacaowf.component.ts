import { Component, Input , OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TipoLaudosService } from '../../shared/services/tipoLaudos.service';
import { Cliente } from '../../shared/models/cliente.model';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import DataSource from 'devextreme/data/data_source';
import { Solicitacao, SolicitacaoToDb } from 'src/app/shared/models/solicitacao.model';
import { SolicitacaoItem, SolicitacaoItemToDb } from 'src/app/shared/models/solicitacaoItem.model';
import { TipoLaudos } from 'src/app/shared/models/tipoLaudos.model';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { SolicitacaoService } from 'src/app/shared/services/solicitacao.service';
import { MalhaLogisticaEntrada } from 'src/app/shared/models/malhaLogisticaEntrada.model';
import { MalhaLogisticaSaida } from 'src/app/shared/models/malhaLogisticaSaida.model';
import { MalhaLogisticaEntradaService } from 'src/app/shared/services/malhaLogisticaEntrada.service';
import { MalhaLogisticaSaidaService } from 'src/app/shared/services/malhaLogisticaSaida.service';
import { ThemeService } from 'ng2-charts';
import { InvokeFunctionExpr } from '@angular/compiler';
import { ErroCargaItensSolicitacao } from '../../shared/models/erroCargaItensSolicitacao.model';
import CheckBox from 'devextreme/ui/check_box';

enum TipoLaudoEnum {
    Novo = 1,
    Adendo,
    Retificacao,
    PreLaudo
}

enum TipoMalhaLogisticaSaida {
    MalhaPadrao = 1,
    MalhaEspecifica
}

enum StatusAndamentoSolicitacao {
    EmAnalise = 1,
    SolicitacoesDevolvidas,
    EmAnaliseDeUrgencia,
    EmAndamento,
    LaudoEntregue,
    PesquisaTributariaEntregue,
    Pendencias,
    Arquivados
}

@Component({
    selector: 'app-solicitacaowf',
    templateUrl: './solicitacaowf.component.html',
    styleUrls: ['./solicitacaowf.component.scss'],
    animations: [routerTransition()],
    providers: [ClienteService]
})
export class SolicitacaoComponent implements OnInit {
    @ViewChild('myInputMalhaLogisticaEntrada', {read: ElementRef, static: false}) private myInputVariableMalhaLogisticaEntrada: ElementRef;
    @ViewChild('myInputMalhaLogisticaSaida', {read: ElementRef, static: false}) private myInputVariableMalhaLogisticaSaida: ElementRef;
    @ViewChild('myInputVariableTemplateCarga', {read: ElementRef, static: false}) private myInputVariableTemplateCarga: ElementRef;
    @ViewChild('controle_erro_urgente', {read: ElementRef, static: false}) controle_erro_urgente: ElementRef;
    @ViewChild('controle_erro_laudopesquisa', {read: ElementRef, static: false}) controle_erro_laudopesquisa: ElementRef;
    @ViewChild('controle_erro_aqruivomalhalogisticaentrada', {read: ElementRef, static: false}) controle_erro_aqruivomalhalogisticaentrada: ElementRef;
    @ViewChild('controle_erro_aqruivomalhalogisticasaida', {read: ElementRef, static: false}) controle_erro_aqruivomalhalogisticasaida: ElementRef;
    @ViewChild('controle_erro_malhapadrao', {read: ElementRef, static: false}) controle_erro_malhapadrao: ElementRef;

    constructor(private solicitacaoService: SolicitacaoService, private malhaLogisticaEntradaService: MalhaLogisticaEntradaService, private malhaLogisticaSaidaService: MalhaLogisticaSaidaService, private clienteService: ClienteService, private tipoLaudosService: TipoLaudosService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isInternalUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }

    @Input() idSolicitacaoWF: number;
    idSolicitacao: number;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    clientes: Cliente[];
    idCliente: number;
    Urgencia: string[] = [];
    Padrao: string[] = [];

    escopos: DataSource;
    selecionados: number[] = [];

    multiple = 'multiple';

    isInternalUser: boolean;
    idUsuario: number;

    isUrgente: boolean;
    UrgenteObrigatorio = false;
    LaudoPesquisaObrigatorio = false;
    isLaudo = false;
    isPesquisaTributaria = false;
    showLaudoOriginal = false;
    isMalhaEspecifica = false;
    isMalhaPadrao = false;
    MalhaLogisticaEntradaObrigatorio = false;
    MalhaLogisticaSaidaObrigatorio = false;
    MostraArquivoMalhaLogisticaEntrada = false;
    MostraArquivoMalhaLogisticaSaida = false;
    MalhaPadraoObrigatorio = false;
    MostraGestaoItens = false;

    tipoLaudos: TipoLaudos[];

    solicitacao: Solicitacao;

    isLoadPanelVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();

    malhaLogisticaEntrada: MalhaLogisticaEntrada[];
    malhaLogisticaSaida: MalhaLogisticaSaida[];

    filePathMalhaLogisticaEntrada = '';
    filePathMalhaLogisticaSaida = '';
    filePathTemplateCarga = '';

    fileDataMalhaLogisticaEntrada: File = null;
    fileDataMalhaLogisticaSaida: File = null;
    fileDataTemplateCarga: File = null;

    btnUploadNaoVisivelMalhaLogisticaEntrada = false;
    btnUploadNaoVisivelMalhaLogisticaSaida = false;
    btnUploadNaoVisivelTemplateCarga = false;

    chkICE = false;
    chkHPC = false;
    chkFOOD = false;
    chkNATURAIS = false;

    errosImportacao: ErroCargaItensSolicitacao[];

    isPopupErrosImportacaoVisible = false;

    itens: SolicitacaoItem[];

    idExclusao: number;
    isPopupConfimarVisible = false;

    defaultUrgencia: string;

    solicitacaoItem: SolicitacaoItem;

    tituloJanelaEdicao: string;

    dataLancamento: string;
    dataAprovacaoUrgencia: string;
    nomeCliente: string;

    isPopupDetalheItemVisible = false;
    exibeArteFOP = false;
    exibeTestesLaboratoriais = false;
    exibeAnvisa = false;
    exibeArteBOP = false;
    exibeOutro = false;
    exibeNcm = false;

    selectedRows: number[];

    disabledValues: number[] = [];

    ngOnInit() {

        this.carregaUrgencia();
        this.caregaTipoLaudos();
        this.carregaClientes();
        this.caregaMalhaLogisticaEntrada();
        this.caregaMalhaLogisticaSaida();

        this.solicitacao = new Solicitacao();
        this.solicitacaoItem = new SolicitacaoItem();

        this.activatedRoute.queryParams.subscribe(params => {
            this.idSolicitacao = params['idSolicitacao'];
            this.carregaSolicitacao();
        });

    }


    carregaSolicitacao(): void {
        if (this.idSolicitacao) {
            this.isLoadPanelVisible = true;
            this.solicitacaoService.obterSolicitacao(this.idSolicitacao).pipe(takeUntil(this.destroy$)).subscribe((data: Solicitacao) => {
                this.isLoadPanelVisible = false;
                this.solicitacao = data;
                this.configuraTela();
            },
            error => {
                this.errorHandler(error);
            });
        }
    }

    formataData(data): string {
        let retorno = '';

        if (data !== undefined && data !== null) {
            const dt = new Date(data);
            const curr_date = dt.getDate();
            const curr_month = dt.getMonth() + 1; // Months are zero based
            const curr_year = dt.getFullYear();
            retorno = ('00' + curr_date).slice(-2) + '/' + ('00' + curr_month).slice(-2) + '/' + curr_year;
        }

          return retorno;
    }

    selectionChangedHandler() {

    }

    configuraTela(): void {
        this.idCliente = this.solicitacao.idCliente;
        this.nomeCliente = this.solicitacao.cnpj + ' - ' + this.solicitacao.nmCliente;
        this.dataLancamento = this.formataData(this.solicitacao.dataLancamento);
        this.dataAprovacaoUrgencia = this.formataData(this.solicitacao.dataAprovacaoUrgencia);
        this.defaultUrgencia = this.solicitacao.urgente === 1 ? 'Sim' : 'Não';
        this.showLaudoOriginal = this.solicitacao.idMalhaLogistica === TipoLaudoEnum.Adendo || this.solicitacao.idMalhaLogistica === TipoLaudoEnum.Retificacao;
        this.isMalhaEspecifica = this.solicitacao.idMalhaLogisticaSaida === TipoMalhaLogisticaSaida.MalhaEspecifica;
        this.isMalhaPadrao = this.solicitacao.idMalhaLogisticaSaida === TipoMalhaLogisticaSaida.MalhaPadrao;
        this.MostraArquivoMalhaLogisticaEntrada = this.solicitacao.uploadMalhaEspecificaFile !== null && this.solicitacao.uploadMalhaEspecificaFile !== undefined;
        this.MostraArquivoMalhaLogisticaSaida = this.solicitacao.uploadMalhaEspecificaFileSaida !== null && this.solicitacao.uploadMalhaEspecificaFileSaida !== undefined;

        this.MostraGestaoItens = true;
        this.carregaListaItens();

        if (this.solicitacao.padroes !== undefined && this.solicitacao.padroes !== null) {
            this.chkICE = this.solicitacao.padroes.indexOf('ICE') > -1;
            this.chkHPC = this.solicitacao.padroes.indexOf('HPC') > -1;
            this.chkFOOD = this.solicitacao.padroes.indexOf('FOOD') > -1;
            this.chkNATURAIS = this.solicitacao.padroes.indexOf('NATURAIS') > -1;
        }


    }

    fileProgressMalhaLogisticaEntrada(fileInput: any) {
        this.limpaValidacaoMalhaLogisticaEntrada();
        this.fileDataMalhaLogisticaEntrada = <File>fileInput.target.files[0];
        this.btnUploadNaoVisivelMalhaLogisticaEntrada = this.fileDataMalhaLogisticaEntrada !== null && this.fileDataMalhaLogisticaEntrada !== undefined;
        if (this.btnUploadNaoVisivelMalhaLogisticaEntrada) {
            this.filePathMalhaLogisticaEntrada = this.fileDataMalhaLogisticaEntrada.name;
        }
    }

    fileProgressMalhaLogisticaSaida(fileInput: any) {
        this.limpaValidacaoMalhaLogisticaSaida();
        this.fileDataMalhaLogisticaSaida = <File>fileInput.target.files[0];
        this.btnUploadNaoVisivelMalhaLogisticaSaida = this.fileDataMalhaLogisticaSaida !== null && this.fileDataMalhaLogisticaSaida !== undefined;
        if (this.btnUploadNaoVisivelMalhaLogisticaSaida) {
            this.filePathMalhaLogisticaSaida = this.fileDataMalhaLogisticaSaida.name;
        }
    }

    onCancelUploadMalhaLogisticaEntrada() {
        this.fileDataMalhaLogisticaEntrada = null;
        this.filePathMalhaLogisticaEntrada = '';
        this.btnUploadNaoVisivelMalhaLogisticaEntrada = false;
        if (this.myInputVariableMalhaLogisticaEntrada !== undefined) {
            this.myInputVariableMalhaLogisticaEntrada.nativeElement.value = '';
        }
    }

    onCancelUploadMalhaLogisticaSaida() {
        this.fileDataMalhaLogisticaSaida = null;
        this.filePathMalhaLogisticaSaida = '';
        this.btnUploadNaoVisivelMalhaLogisticaSaida = false;
        if (this.myInputVariableMalhaLogisticaSaida !== undefined) {
            this.myInputVariableMalhaLogisticaSaida.nativeElement.value = '';
        }
    }

    carregaClientes(): void {
        // Carrega clientes de acesso
        this.isLoadPanelVisible = true;
        this.clienteService.listarClientesAtivos()
              .subscribe(retoroListCliente => {
                this.isLoadPanelVisible = false;
                  this.clientes = retoroListCliente;
              },
              error => {
                  this.errorHandler(error);
              });
    }

    carregaUrgencia() {
        this.Urgencia.push('Sim');
        this.Urgencia.push('Não');
    }

    caregaMalhaLogisticaEntrada() {
        this.malhaLogisticaEntradaService.listaMalhaLogisticaEntrada().subscribe((res: MalhaLogisticaEntrada[]) => {
            this.malhaLogisticaEntrada = res;
            },
            error => {
                this.errorHandler(error);
            });
    }

    caregaMalhaLogisticaSaida() {
        this.malhaLogisticaSaidaService.listaMalhaLogisticaSaida().subscribe((res: MalhaLogisticaSaida[]) => {
            this.malhaLogisticaSaida = res;
            },
            error => {
                this.errorHandler(error);
            });
    }

    caregaTipoLaudos() {
        this.tipoLaudosService.listTipoLaudos().subscribe((res: TipoLaudos[]) => {
            this.tipoLaudos = res;
            },
            error => {
                this.errorHandler(error);
            });
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    checkOpcoes_valueChanged(e) {
        if (e.value) {
            this.limpaValidacaoLaudoPesquisa();
        }

        if (e.element.innerText === 'Laudo') {
            this.isLaudo = e.value;
            if (!e.value) {
                this.showLaudoOriginal = false;
            }
        } else if (e.element.innerText === 'Pesquisa tributária') {
            this.isPesquisaTributaria = e.value;

            if (!e.value) {
                this.isMalhaEspecifica = false;
                this.isMalhaPadrao = false;
            }
        }
    }

    checkPadrao_valueChanged(e) {

        if (e.element.innerText === 'ICE') {
            this.chkICE = e.value;
        }

        if (e.element.innerText === 'HPC') {
            this.chkHPC = e.value;
        }

        if (e.element.innerText === 'FOOD') {
            this.chkFOOD = e.value;
        }

        if (e.element.innerText === 'NATURAIS') {
            this.chkNATURAIS = e.value;
        }
    }

    onValueChanged(e) {
        this.limpaValidacaoUrgente();
        this.isUrgente = e.value === 'Sim';
    }

    voltar(): void {
        this.router.navigate(['listasolicitacao']);
    }

    onValueChangedTipoLaudo(e) {
        this.showLaudoOriginal = e.value === TipoLaudoEnum.Adendo || e.value === TipoLaudoEnum.Retificacao;
    }

    onValueChangedMalhaLogisticaSaida(e) {
        this.limpaValidacaoMalhaLogisticaSaida();
        this.limpaValidacaoMalhaPadrao();
        this.isMalhaEspecifica = e.value === TipoMalhaLogisticaSaida.MalhaEspecifica;
        this.isMalhaPadrao = e.value === TipoMalhaLogisticaSaida.MalhaPadrao;
    }

    validaCNPJ(e): boolean {

        let retorno = true;
        let cnpj = e.value;

        if (cnpj.trim() === '') {
            retorno = true;
        } else {
            cnpj = cnpj.replace(/[^\d]+/g, '');

            if (cnpj === '') {
                retorno = false;
            }

            if (cnpj.length !== 14) {
                retorno = false;
            }

            // Elimina CNPJs invalidos conhecidos
            if (cnpj === '00000000000000' ||
                cnpj === '11111111111111' ||
                cnpj === '22222222222222' ||
                cnpj === '33333333333333' ||
                cnpj === '44444444444444' ||
                cnpj === '55555555555555' ||
                cnpj === '66666666666666' ||
                cnpj === '77777777777777' ||
                cnpj === '88888888888888' ||
                cnpj === '99999999999999') {
                    retorno = false;
                }

            // Valida DVs
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0, tamanho);
            const digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += Number(numeros.charAt(tamanho - i)) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== Number(digitos.charAt(0))) {
                retorno = false;
            }

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
            soma += Number(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== Number(digitos.charAt(1))) {
                retorno = false;
            }
        }

        return retorno;
    }

    validaCampoUrgente(): boolean {
        let retorno = false;
        if (this.isUrgente === undefined) {
            if (this.controle_erro_urgente !== undefined) {
                this.controle_erro_urgente.nativeElement.style.width = '200px';
                this.controle_erro_urgente.nativeElement.style.padding = '3px';
                this.controle_erro_urgente.nativeElement.style.border = '1px solid #D9534F';
            }

            this.UrgenteObrigatorio = true;
            return;
        } else {
            this.limpaValidacaoUrgente();
            retorno = true;
        }
        return retorno;
    }

    limpaValidacaoUrgente() {
        if (this.UrgenteObrigatorio === true) {
            if (this.controle_erro_urgente !== undefined) {
                this.controle_erro_urgente.nativeElement.style.padding = '0px';
                this.controle_erro_urgente.nativeElement.style.border = '0px';
            }

            this.UrgenteObrigatorio = false;
        }
    }

    validaLaudoPesquisa() {
        let retorno = false;
        if (!this.isLaudo && !this.isPesquisaTributaria) {
            if (this.controle_erro_laudopesquisa !== undefined) {
                this.controle_erro_laudopesquisa.nativeElement.style.width = '250px';
                this.controle_erro_laudopesquisa.nativeElement.style.padding = '3px';
                this.controle_erro_laudopesquisa.nativeElement.style.border = '1px solid #D9534F';
            }


            this.LaudoPesquisaObrigatorio = true;
            return;
        } else {
            this.limpaValidacaoLaudoPesquisa();
            retorno = true;
        }
        return retorno;
    }

    limpaValidacaoLaudoPesquisa() {
        if (this.LaudoPesquisaObrigatorio === true) {
            if (this.controle_erro_laudopesquisa !== undefined) {
                this.controle_erro_laudopesquisa.nativeElement.style.padding = '0px';
                this.controle_erro_laudopesquisa.nativeElement.style.border = '0px';
            }


            this.LaudoPesquisaObrigatorio = false;
        }
    }

    validaMalhaLogisticaEntrada() {
        let retorno = false;
        if (this.isPesquisaTributaria && !this.btnUploadNaoVisivelMalhaLogisticaEntrada && !this.MostraArquivoMalhaLogisticaEntrada) {
            if (this.controle_erro_aqruivomalhalogisticaentrada !== undefined) {
                this.controle_erro_aqruivomalhalogisticaentrada.nativeElement.style.width = '500px';
                this.controle_erro_aqruivomalhalogisticaentrada.nativeElement.style.padding = '3px';
                this.controle_erro_aqruivomalhalogisticaentrada.nativeElement.style.border = '1px solid #D9534F';
            }

            this.MalhaLogisticaEntradaObrigatorio = true;
            return;
        } else {
            this.limpaValidacaoMalhaLogisticaEntrada();
            retorno = true;
        }
        return retorno;
    }

    limpaValidacaoMalhaLogisticaEntrada() {
        if (this.MalhaLogisticaEntradaObrigatorio === true) {
            if (this.controle_erro_aqruivomalhalogisticaentrada !== undefined) {
                this.controle_erro_aqruivomalhalogisticaentrada.nativeElement.style.padding = '0px';
                this.controle_erro_aqruivomalhalogisticaentrada.nativeElement.style.border = '0px';
            }
            this.MalhaLogisticaEntradaObrigatorio = false;
        }
    }

    validaMalhaLogisticaSaida() {
        let retorno = false;
        if (this.isMalhaEspecifica && !this.btnUploadNaoVisivelMalhaLogisticaSaida && !this.MostraArquivoMalhaLogisticaSaida) {
            if (this.controle_erro_aqruivomalhalogisticasaida !== null) {
                this.controle_erro_aqruivomalhalogisticasaida.nativeElement.style.width = '500px';
                this.controle_erro_aqruivomalhalogisticasaida.nativeElement.style.padding = '3px';
                this.controle_erro_aqruivomalhalogisticasaida.nativeElement.style.border = '1px solid #D9534F';
            }

            this.MalhaLogisticaSaidaObrigatorio = true;
            return;
        } else {
            this.limpaValidacaoMalhaLogisticaSaida();
            retorno = true;
        }
        return retorno;
    }

    limpaValidacaoMalhaLogisticaSaida() {
        if (this.MalhaLogisticaSaidaObrigatorio === true) {
            if (this.controle_erro_aqruivomalhalogisticasaida !== undefined) {
                this.controle_erro_aqruivomalhalogisticasaida.nativeElement.style.padding = '0px';
                this.controle_erro_aqruivomalhalogisticasaida.nativeElement.style.border = '0px';
            }

            this.MalhaLogisticaSaidaObrigatorio = false;
        }
    }

    validaMalhaPadrao() {
        let retorno = false;

        const chkNenhum = !this.chkICE && !this.chkHPC && !this.chkFOOD && !this.chkNATURAIS;

        if (this.isMalhaPadrao && chkNenhum) {
            if (this.controle_erro_malhapadrao !== undefined) {
                this.controle_erro_malhapadrao.nativeElement.style.width = '500px';
                this.controle_erro_malhapadrao.nativeElement.style.padding = '3px';
                this.controle_erro_malhapadrao.nativeElement.style.border = '1px solid #D9534F';
            }

            this.MalhaPadraoObrigatorio = true;
            return;
        } else {
            this.limpaValidacaoMalhaPadrao();
            retorno = true;
        }
        return retorno;
    }

    limpaValidacaoMalhaPadrao() {
        if (this.MalhaPadraoObrigatorio === true) {
            if (this.controle_erro_malhapadrao !== undefined) {
                this.controle_erro_malhapadrao.nativeElement.style.padding = '0px';
                this.controle_erro_malhapadrao.nativeElement.style.border = '0px';
            }


            this.MalhaPadraoObrigatorio = false;
        }
    }

    downloadExemplo() {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = '../../../assets/templates/Template_Carga_Itens_Solicitacao.xlsx';
        link.download = 'Template_Carga_Itens_Solicitacao.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    onFormItemSubmit = function(e) {
        e.preventDefault();
    };

    onFormSubmit = function(e) {
        e.preventDefault();

        const isUrgenteValido = this.validaCampoUrgente();
        const isLaudoPesquisaValido = this.validaLaudoPesquisa();
        const isMalhaLogisticaEntradaValido = this.validaMalhaLogisticaEntrada();
        const isMalhaLogisticaSaidaValido = this.validaMalhaLogisticaSaida();
        const isMalhaPadraoValido = this.validaMalhaPadrao();

        if (!isUrgenteValido || !isLaudoPesquisaValido || !isMalhaLogisticaEntradaValido || !isMalhaLogisticaSaidaValido || !isMalhaPadraoValido) {
            return;
        }

        const solicitacaoWFToDb: SolicitacaoToDb = new SolicitacaoToDb();

        const formData = new FormData();
        if (this.solicitacao.idSolicitacao !== undefined && this.solicitacao.idSolicitacao !== null) {
            formData.append('IdSolicitacao', this.solicitacao.idSolicitacao);
        }

        if (this.solicitacao.idSolicitacaoWorkflow !== undefined && this.solicitacao.idSolicitacaoWorkflow !== null) {
            formData.append('IdSolicitacaoWorkflow', this.IdSolicitacao);
        }

        if (this.fileDataMalhaLogisticaEntrada !== undefined && this.fileDataMalhaLogisticaEntrada !== null) {
            formData.append('ArquivoMalhaEspecificaEntrada', this.fileDataMalhaLogisticaEntrada);
        }

        if (this.fileDataMalhaLogisticaSaida !== undefined && this.fileDataMalhaLogisticaSaida !== null) {
            formData.append('ArquivoMalhaEspecificaSaida', this.fileDataMalhaLogisticaSaida);
        }


        formData.append('NomeProjeto', this.solicitacao.nomeProjeto);
        formData.append('IdCliente', this.idCliente);
        formData.append('CentroCusto', this.solicitacao.centroCusto);
        formData.append('Owner', this.solicitacao.owner);
        formData.append('Laudos', this.isLaudo ? '1' : '0');
        formData.append('Vistas', this.isPesquisaTributaria ? '1' : '0');
        formData.append('IdTipoLaudo', this.solicitacao.idTipoLaudo);
        formData.append('IdTipoUrgencia', this.isUrgente ? '1' : '0');

        if (this.solicitacao.comentario !== undefined && this.solicitacao.comentario !== null) {
            formData.append('Comentario', this.solicitacao.comentario);
        }

        formData.append('DataLancamento', this.solicitacao.dataLancamento   );
        if (this.solicitacao.idMalhaLogistica !== undefined && this.solicitacao.idMalhaLogistica !== null) {
            formData.append('IdMalhaLogistica', this.solicitacao.idMalhaLogistica);
        }

        formData.append('IdStatusAndamento', StatusAndamentoSolicitacao.EmAnalise.toString());

        formData.append('Urgente', this.isUrgente ? '1' : '0');

        if (this.solicitacao.comentarioUrgencia !== undefined && this.solicitacao.comentarioUrgencia !== null) {
            formData. append('ComentarioUrgencia', this.solicitacao.comentarioUrgencia);
        }

        if (this.solicitacao.dataAprovacaoUrgencia !== undefined && this.solicitacao.dataAprovacaoUrgencia !== null) {
            formData.append('DataAprovacaoUrgencia', this.solicitacao.dataAprovacaoUrgencia);
        }

        if (this.solicitacao.idMalhaLogisticaSaida !== undefined && this.solicitacao.idMalhaLogisticaSaida !== null) {
            formData.append('IdMalhaLogisticaSaida',  this.solicitacao.idMalhaLogisticaSaida);
        }

        // formData.append('PrevisaoLaudo', this.solicitacao.dataLancamento);
        // formData.append('PrevisaoDoPrazo', this.solicitacao.previsaoDoPrazo);
        // formData.append('PrevisaoValorLaudo', this.solicitacao.previsaoValorLaudo);
        // formData.append('PrevisaoDoValor', this.solicitacao.previsaoDoValor);

        // formData.append('PrazoLaudo', this.solicitacao.prazoLaudo);
        // formData.append('PrazoVistas', this.solicitacao.prazoVistas);
        // formData.append('ValorLaudos', this.solicitacao.valorLaudos);
        // formData.append('ValorVistas', this.solicitacao.valorVistas);

        if (this.solicitacao.numeroLaudoOriginal !== undefined && this.solicitacao.numeroLaudoOriginal !== null) {
            formData.append('NumeroLaudoOriginal', this.solicitacao.numeroLaudoOriginal);
        }

        formData.append('Padroes', this.montaRetornoMalhaPadrao());

        this.isLoadPanelVisible = true;
          this.solicitacaoService.criaSolicitacaoFromADAM(formData).pipe(takeUntil(this.destroy$)).subscribe((res: Solicitacao) => {
            this.isLoadPanelVisible = false;
            this.solicitacao.idSolicitacao = res.idSolicitacao;
            this.solicitacao.uploadMalhaEspecificaFile = res.uploadMalhaEspecificaFile;
            this.solicitacao.uploadMalhaEspecificaFileSaida = res.uploadMalhaEspecificaFileSaida;
            this.MostraArquivoMalhaLogisticaEntrada = true;
            this.MostraArquivoMalhaLogisticaSaida = true;
            this.MostraGestaoItens = true;

            this.onCancelUploadMalhaLogisticaEntrada();
            this.onCancelUploadMalhaLogisticaSaida();

            this.isPopupVisible = true;
        },
        error => {
            this.errorHandler(error);
        });

    };

    montaRetornoMalhaPadrao(): string {
        let retorno = '';

        if (this.isMalhaPadrao) {
            if (this.chkICE) {
                if (retorno === '') {
                    retorno =  'ICE';
                } else {
                    retorno = retorno + '|ICE';
                }
            }

            if (this.chkHPC) {
                if (retorno === '') {
                    retorno = 'HPC';
                } else {
                    retorno = retorno + '|HPC';
                }
            }

            if (this.chkFOOD) {
                if (retorno === '') {
                    retorno = 'FOOD';
                } else {
                    retorno = retorno + '|FOOD';
                }
            }

            if (this.chkNATURAIS) {
                if (retorno === '') {
                    retorno = 'NATURAIS';
                } else {
                    retorno = retorno + '|NATURAIS';
                }
            }
        }

        return retorno;
    }

    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    popup_hidden(e): void {
        // this.router.navigate(['requests']);
    }

    downloadTemplate(nomeArquivo) {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = '../../../assets/templates/' + nomeArquivo;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    downloadMalhaLogistica(IdMalhaLogisticaEntradaSaida: number) {
        let nome: string;

        if (IdMalhaLogisticaEntradaSaida === 1) {
            nome = this.solicitacao.uploadMalhaEspecificaFile;
        } else if (IdMalhaLogisticaEntradaSaida === 2) {
            nome = this.solicitacao.uploadMalhaEspecificaFileSaida;
        }

        const posicao =  nome.lastIndexOf('.');
        const extensao = nome.substring(posicao, nome.length).toLocaleLowerCase();
        this.isLoadPanelVisible = true;
        this.solicitacaoService.DownloadFile(this.solicitacao.idSolicitacao, IdMalhaLogisticaEntradaSaida).subscribe(
          data => {
            switch (data.type) {
              case HttpEventType.Response:
                const downloadedFile = new Blob([data.body], { type: data.body.type });
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
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

    downloadArquivoItem(IdSolicitacaoItem: number, IdTipoArquivoSolicitacaoItem: number, nome: string) {
        const posicao =  nome.lastIndexOf('.');
        const extensao = nome.substring(posicao, nome.length).toLocaleLowerCase();
        this.isLoadPanelVisible = true;
        this.solicitacaoService.DownloadFileItem(IdSolicitacaoItem, IdTipoArquivoSolicitacaoItem).subscribe(
          data => {
            switch (data.type) {
              case HttpEventType.Response:
                const downloadedFile = new Blob([data.body], { type: data.body.type });
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
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

    deletarItem(e, data) {
        this.idExclusao  = data.row.data.idSolicitacaoItem;
        this.isPopupConfimarVisible = true;
    }

    editarItem(e, data) {
        this.solicitacaoItem = data.row.data;
        this.exibeArteFOP = this.solicitacaoItem.arteFOPfile !== undefined && this.solicitacaoItem.arteFOPfile !== null;
        this.exibeTestesLaboratoriais = this.solicitacaoItem.testeLaboratorialFile !== undefined && this.solicitacaoItem.testeLaboratorialFile !== null;
        this.exibeAnvisa = this.solicitacaoItem.anvisa !== undefined && this.solicitacaoItem.anvisa !== null;
        this.exibeArteBOP = this.solicitacaoItem.arteBOPfile !== undefined && this.solicitacaoItem.arteBOPfile !== null;
        this.exibeOutro = this.solicitacaoItem.outrosFile !== undefined && this.solicitacaoItem.outrosFile !== null;
        this.exibeNcm = this.solicitacaoItem.ncm !== undefined && this.solicitacaoItem.ncm !== null;
        this.isPopupDetalheItemVisible = true;
    }

    fileProgressTemplateCarga(fileInput: any) {
        this.fileDataTemplateCarga = <File>fileInput.target.files[0];
        this.btnUploadNaoVisivelTemplateCarga = this.fileDataTemplateCarga !== null && this.fileDataTemplateCarga !== undefined;
        if (this.btnUploadNaoVisivelTemplateCarga) {
            this.filePathTemplateCarga = this.fileDataTemplateCarga.name;
        }
    }

    onCancelUploadTemplateCarga() {
        this.fileDataTemplateCarga = null;
        this.filePathTemplateCarga = '';
        this.btnUploadNaoVisivelTemplateCarga = false;
        if (this.myInputVariableTemplateCarga !== undefined) {
            this.myInputVariableTemplateCarga.nativeElement.value = '';
        }

    }

    onUploadTemplateCarga() {
        const formData = new FormData();
        formData.append('file', this.fileDataTemplateCarga);
        formData.append('idSolicitacao', this.solicitacao.idSolicitacao.toString());
        formData.append('idUsuario', this.idUsuario.toString());

            this.isLoadPanelVisible = true;
            this.solicitacaoService.carregarEntradaItens(formData).pipe(takeUntil(this.destroy$)).subscribe((res: ErroCargaItensSolicitacao[]) => {
            this.isLoadPanelVisible = false;

            this.onCancelUploadTemplateCarga();

            if (res !== null && res.length > 0) {
                this.errosImportacao = res;
                this.isPopupErrosImportacaoVisible = true;
            }

            this.carregaListaItens();
        },
        error => {
            this.errorHandler(error);
        });

    }

    fecharDetalheItem() {
        this.isPopupDetalheItemVisible = false;
    }

    carregaListaItens(): void {
        this.isLoadPanelVisible = true;
        this.solicitacaoService.listItems(this.solicitacao.idSolicitacao).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
            this.isLoadPanelVisible = false;
            this.itens = data;
        },
        error => {
            this.errorHandler(error);
        });
    }

    onSelectionChanged(e) {
        // e.component.deselectRows(e.currentSelectedRowKeys);

        /*
        const disabledKeys = e.currentSelectedRowKeys.filter(i => this.disabledValues.indexOf(i.ID) > -1);
        if (disabledKeys.length > 0)  {
            e.component.deselectRows(disabledKeys);
        }
        */
    }

    onCellPrepared(e) {

        if (e.rowType === 'data' && e.column.dataField === 'cdArteFOP') {
            const ele = e.cellElement;

            this.disabledValues.push(e.data.idSolicitacaoItem);

            if (
                (e.data.cdArteFOP !== undefined || e.data.cdArteFOP !== null || e.data.cdArteFOP !== '')
                &&
                (e.data.arteFOPfile === undefined || e.data.arteFOPfile === null || e.data.arteFOPfile === '')
            ) {
                ele.firstElementChild.children[0].style.display = 'block';
                ele.firstElementChild.children[1].style.display = 'none';
                ele.firstElementChild.children[2].style.display = 'none';
            } else if (
                (e.data.cdArteFOP === undefined || e.data.cdArteFOP === null || e.data.cdArteFOP === '')
                &&
                (e.data.arteFOPfile !== undefined || e.data.arteFOPfile !== null || e.data.arteFOPfile !== '')
            ) {
                ele.firstElementChild.children[0].style.display = 'none';
                ele.firstElementChild.children[1].style.display = 'block';
                ele.firstElementChild.children[2].style.display = 'none';
            } else if (
                (e.data.cdArteFOP !== undefined || e.data.cdArteFOP !== null || e.data.cdArteFOP !== '')
                &&
                (e.data.arteFOPfile !== undefined || e.data.arteFOPfile !== null || e.data.arteFOPfile !== '')
            ) {
                ele.firstElementChild.children[0].style.display = 'none';
                ele.firstElementChild.children[1].style.display = 'none';
                ele.firstElementChild.children[2].style.display = 'block';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'cdArteBOP') {
            const ele = e.cellElement;

            if (
                (e.data.cdArteBOP !== undefined || e.data.cdArteBOP !== null || e.data.cdArteBOP !== '')
                &&
                (e.data.arteBOPfile === undefined || e.data.arteBOPfile === null || e.data.arteBOPfile === '')
            ) {
                ele.firstElementChild.children[0].style.display = 'block';
                ele.firstElementChild.children[1].style.display = 'none';
                ele.firstElementChild.children[2].style.display = 'none';
            } else if (
                (e.data.cdArteBOP === undefined || e.data.cdArteBOP === null || e.data.cdArteBOP === '')
                &&
                (e.data.arteBOPfile !== undefined || e.data.arteBOPfile !== null || e.data.arteBOPfile !== '')
            ) {
                ele.firstElementChild.children[0].style.display = 'none';
                ele.firstElementChild.children[1].style.display = 'block';
                ele.firstElementChild.children[2].style.display = 'none';
            } else if (
                (e.data.cdArteBOP !== undefined || e.data.cdArteBOP !== null || e.data.cdArteBOP !== '')
                &&
                (e.data.arteBOPfile !== undefined || e.data.arteBOPfile !== null || e.data.arteBOPfile !== '')
            ) {
                ele.firstElementChild.children[0].style.display = 'none';
                ele.firstElementChild.children[1].style.display = 'none';
                ele.firstElementChild.children[2].style.display = 'block';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'testeLaboratorialFile') {
            const ele = e.cellElement;
            if (e.data.testeLaboratorialFile === undefined || e.data.testeLaboratorialFile === null || e.data.testeLaboratorialFile === '') {
                ele.firstElementChild.style.display = 'none';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'outrosFile') {
            const ele = e.cellElement;
            if (e.data.outrosFile === undefined || e.data.outrosFile === null || e.data.outrosFile === '') {
                ele.firstElementChild.style.display = 'none';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'outrosFile') {
            const ele = e.cellElement;
            if (e.data.outrosFile === undefined || e.data.outrosFile === null || e.data.outrosFile === '') {
                ele.firstElementChild.style.display = 'none';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'laudoItem') {
            const ele = e.cellElement;
            if (e.data.laudoItem === true) {
                ele.firstElementChild.innerHTML = '<i class="fa fa-check iconeVerde"></i>';
            }
        } else if (e.rowType === 'data' && e.column.dataField === 'pesquisaTribItem') {
            const ele = e.cellElement;
            if (e.data.pesquisaTribItem === true) {
                ele.firstElementChild.innerHTML = '<i class="fa fa-check iconeVerde"></i>';
            }
        } else if (e.rowType === 'data' && e.column.dataField !== 'flAtivo') {
            const ele = e.cellElement;

            if (e.data.flAtivo) {
                ele.style.color = 'black';
            } else {
                ele.style.color = 'gray';
            }
        }
        // <i class="fa fa-check iconeVerde"></i>
    }

    fecharErros() {
        this.isPopupErrosImportacaoVisible = false;
    }

}

