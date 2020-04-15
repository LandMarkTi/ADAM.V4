export class Item {
    idItem: number;
    idRequest: number;
    cdRequest: string;
    nrSKU: string;
    dsCurta: string;
    dsCompleta: string;
    idNCM: number;
    cdNCM: string;
    dsNCM: string;
    idUsuarioElaborador: number;
    idusuarioRevisor: number;
    idStatusItem: number;
    dsStatusItem: string;
    flAtivo: boolean;
    dtCriacao: Date;
    idUsuarioCriacao: number;
    dtUltimaModificacao: Date;
    idUsuarioUltimaModificacao: number;
    dtInicioEtapa: Date;
}

export class ItemToDb {
    IdItem: number;
    IdRequest: number;
    NrSKU: string;
    DsCurta: string;
    DsCompleta: string;
    IdNCM: number;
    IdUsuarioElaborador: number;
    IdusuarioRevisor: number;
    IdStatusItem: number;
    FlAtivo: boolean;
    DtCriacao: Date;
    IdUsuarioCriacao: number;
    DtUltimaModificacao: Date;
    IdUsuarioUltimaModificacao: number;
    DtInicioEtapa: Date;
}

export class StatusItem {
    idStatusItem: number;
    dsStatusItem: string;
    flAtivo: boolean;
}
