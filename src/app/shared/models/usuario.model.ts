export class Usuario {
    idUsuario: number;
    nmUsuario: string;
    dsEmail: string;
    dsPassword: string;
    dsPassword2: string;
    idPerfilAcesso: number;
    nmPerfilAcesso: string;
    idCliente: number;
    nmCliente: string;
    dtSolicitacaoMudancaSenha: Date;
    cdSolicitacaoMudancaSenha: number;
    flAtivo: boolean;
}

export class UsuarioToDb {
    IdUsuario: number;
    NmUsuario: string;
    DsEmail: string;
    DsPassword: string;
    IdPerfilAcesso: number;
    IdCliente: number;
    FlAtivo: boolean;
}
