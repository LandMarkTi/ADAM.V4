export class Mensagem {
    idMensagem: number;
    idItem: number;
    dsMensagemElaboracao: string;
    idOrigemMensagem: number;
    nmOrigemMensagem: string;
    idDestinoMensagem: number;
    nmDestinoMensagem: string;
    flVisualizado: boolean;
    flAtivo: boolean;
    dtCriacao: Date;
    idUsuario: number;
    nmUsuario: string;
    inteiros: number[];
}

export class MensagemToDb {
    IdMensagem: number;
    IdItem: number;
    DsMensagemElaboracao: string;
    IdOrigemMensagem: number;
    IdDestinoMensagem: number;
    FlVisualizado: boolean;
    FlAtivo: boolean;
    DtCriacao: Date;
    IdUsuario: number;
}
