export class RespostaCliente {
    idMensagemElaboracao: number;
    idItem: number;
    idMensagemPai: number;
    dsMensagemElaboracao: string;
    idUsuario: number;
}

export class RespostaClienteToDb {
    IdMensagemElaboracao: number;
    IdItem: number;
    IdMensagemPai: number;
    DsMensagemElaboracao: string;
    IdUsuario: number;
    FlRespondido: boolean;
}
