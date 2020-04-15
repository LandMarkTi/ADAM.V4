export class Request {
    idRequest: number;
    cdDebito: string;
    cdRequest: string;
    nmRequest: string;
    idCliente: number;
    nmCliente: string;
    idStatusRequest: number;
    dsStatusRequest: string;
    flAtivo: boolean;
    dtCriacao: Date;
    idUsuarioCriacao: number;
    dtUltimaModificacao: Date;
    idUsuarioUltimaModificacao: number;
}

export class RequestToDb {
    IdRequest: number;
    CdDebito: string;
    CdRequest: string;
    NmRequest: string;
    IdCliente: number;
    IdStatusRequest: number;
    FlAtivo: boolean;
    DtCriacao: Date;
    IdUsuarioCriacao: number;
    DtUltimaModificacao: Date;
    IdUsuarioUltimaModificacao: number;
}

export class StatusRequest {
    idStatusRequest: number;
    dsStatusRequest: string;
    flAtivo: boolean;
}
