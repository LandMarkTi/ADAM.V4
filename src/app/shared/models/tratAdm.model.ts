export class TratAdm {
    idTratamentoAdministrativo: number;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    dtInicial: Date;
    dtFinal: Date;
    dsTipo: string;
    dsOrgao: string;
    dsFinalidade: string;
    dsTratamento: string;
    dsDestaque: string;
    dsDescDestaque: string;
    dsFuncao: string;
    dsPais: string;
    dsExcecao: string;
    dsNotas: string;
    flAtivo: boolean;
    dtCriacao: Date;
}

export class TratAdmToDb {

    IdTratamentoAdministrativo: number;
    IdNCM: number;
    DtInicial: Date;
    DtFinal: Date;
    DsTipo: string;
    DsOrgao: string;
    DsFinalidade: string;
    DsTratamento: string;
    DsDestaque: string;
    DsDescDestaque: string;
    DsFuncao: string;
    DsPais: string;
    DsExcecao: string;
    DsNotas: string;
    FlAtivo: boolean;
    DtCriacao: Date;
}

export class TratAdmElaboracao {
    flUtilizado: boolean;
    idTratamentoAdministrativo: number;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    dtInicial: Date;
    dtFinal: Date;
    dsTipo: string;
    dsOrgao: string;
    dsFinalidade: string;
    dsTratamento: string;
    dsDestaque: string;
    dsDescDestaque: string;
    dsFuncao: string;
    dsPais: string;
    dsExcecao: string;
    dsNotas: string;
    flAtivo: boolean;
    dtCriacao: Date;
}

export class TratAdmElaboracaoToDb {
    IdItem: number;
    TratAdmSelecionadas: number[];
}
