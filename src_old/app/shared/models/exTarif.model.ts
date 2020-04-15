export class ExTarif {
    idExTarif: number;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    cdEx: string;
    dsDescricao: string;
    aliqIIN: number;
    aliqIIV: number;
    aliqIPI: number;
    aliqPis: number;
    aliqCofins: number;
    dsICMS: string;
    dsST: string;
    dsSSN: string;
    flAtivo: boolean;
    dtCriacao: Date;
}

export class ExTarifToDb {

    IdExTarif: number;
    IdNCM: number;
    CdEx: string;
    DsDescricao: string;
    AliqIIN: number;
    AliqIIV: number;
    AliqIPI: number;
    AliqPis: number;
    AliqCofins: number;
    DsICMS: string;
    DsST: string;
    DsSSN: string;
    FlAtivo: boolean;
    DtCriacao: Date;
}

export class ExTarifElaboracao {
    idExTarif: number;
    flUtilizado: boolean;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    cdEx: string;
    dsDescricao: string;
    aliqIIN: number;
    aliqIIV: number;
    aliqIPI: number;
    aliqPis: number;
    aliqCofins: number;
    dsICMS: string;
    dsST: string;
    dsSSN: string;
    flAtivo: boolean;
    dtCriacao: Date;
}

export class ExTarifElaboracaoToDb {
    IdItem: number;
    ExTarifSelecionadas: number[];
}
