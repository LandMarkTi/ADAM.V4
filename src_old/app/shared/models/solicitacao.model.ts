import { DecimalPipe } from '@angular/common';

export class Solicitacao {

    idSolicitacao: number;
    idSolicitacaoWorkflow: number;
    nomeProjeto: string;
    cnpj: string;
    idCliente: number;
    nmCliente: string;
    centroCusto: string;
    owner: string;
    laudos: boolean;
    vistas: boolean;
    idTipoLaudo: number;
    nmTipoLaudo: string;
    urgente: number;
    comentario: string;
    dataLancamento: Date;
    idMalhaLogistica: number;
    nmMalhaLogistica: string;
    uploadMalhaEspecificaFile: string;
    previsaoLaudo: Date;
    previsaoDoPrazo: Date;
    previsaoValorLaudo: number;
    previsaoDoValor: number;
    idStatusAndamento: number;
    dsStatusAndamentoSolicitacao: string;
    laudosOuVistas: number;
    comentarioUrgencia: string;
    dataAprovacaoUrgencia: Date;
    idMalhaLogisticaSaida: number;
    nmMalhaLogisticaSaida: string;
    uploadMalhaEspecificaFileSaida: string;
    prazoLaudo: string;
    prazoVistas: string;
    valorLaudos: number;
    valorVistas: number;
    numeroLaudoOriginal: string;
    padroes: string;

}

export class SolicitacaoToDb {

    IdSolicitacao: number;
    IdSolicitacaoWorkflow: number;
    NomeProjeto: string;
    Cnpj: string;
    IdCliente: number;
    CentroCusto: string;
    Owner: string;
    Laudos: boolean;
    Vistas: boolean;
    IdTipoLaudo: number;
    Comentario: string;
    DataLancamento: Date;
    IdMalhaLogistica: number;
    UploadMalhaEspecificaFile: string;
    PrevisaoLaudo: Date;
    PrevisaoDoPrazo: Date;
    PrevisaoValorLaudo: number;
    PrevisaoDoValor: number;
    IdStatusAndamento: number;
    DsStatusAndamentoSolicitacao: string;
    Urgente: number;
    ComentarioUrgencia: string;
    DataAprovacaoUrgencia: Date;
    IdMalhaLogisticaSaida: number;
    UploadMalhaEspecificaFileSaida: string;
    PrazoLaudo: string;
    PrazoVistas: string;
    ValorLaudos: number;
    ValorVistas: number;
    NumeroLaudoOriginal: string;
    Padroes: string;
    ConteudoUploadMalhaEspecificaFile: Blob;
	ConteudoUploadMalhaEspecificaFileSaida: Blob;
}

