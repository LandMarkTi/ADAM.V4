export class Nve {
    idNVE: number;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    dsNivel: string;
    dsAtributo: string;
    dsEspecificacao: string;
    cdEspecificacao: string;
    flAtivo: boolean;
    dtCriacao: Date;
}

export class NveToDb {

    IdNVE: number;
    IdNCM: number;
    DsNivel: string;
    DsAtributo: string;
    DsEspecificacao: string;
    CdEspecificacao: string;
    FlAtivo: boolean;
    DtCriacao: Date;
}

export class NveElaboracao {
    flUtilizado: boolean;
    idNVE: number;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    dsNivel: string;
    dsAtributo: string;
    dsEspecificacao: string;
    flAtivo: boolean;
    dtCriacao: Date;
}

export class NveElaboracaoToDb {
    IdItem: number;
    NvesSelecionadas: number[];
}
