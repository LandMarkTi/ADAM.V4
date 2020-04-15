export class Cliente {

    idCliente: number;
    dsSigla: string;
    nmCliente: string;
    nrCNPJ: string;
    dsObservacao: string;
    flAtivo: boolean;
    destinatarios: Destinatario[] = [];
}

export class ClienteToDb {

    IdCliente: number;
    DsSigla: string;
    NmCliente: string;
    NrCNPJ: string;
    DsObservacao: string;
    FlAtivo: boolean;
    Destinatarios: DestinatarioToDb[];
}

export class Destinatario {
    idClienteDestinatario: number;
    idCliente: number;
    dsEmail: string;
    nmDestinatario: string;
    flAtivo: boolean;
}
export class DestinatarioToDb {
    IdCliente: number;
    Destinatarios: Email[] = [];
}

export class Email {
    IdClienteDestinatario: number;
    IdCliente: number;
    DsEmail: string;
    NmDestinatario: string;
    FlAtivo: boolean;
}
