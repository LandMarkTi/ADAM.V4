export class SolicitacaoItem {
    idSolicitacaoItem: number;
    idSolicitacaoItemWorkflow: number;
    idSolicitacaoWorkflow: number;
    cdSku: string;
    cdArteFOP: string;
    descricao: string;
    cdArteBOP: string;
    anvisa: string;
    arteFOPfile: string;
    arteBOPfile: string;
    testeLaboratorialFile: string;
    outrosFile: string;
    laudoItem: boolean;
    laudoItemFile: string;
    pesquisaTribItem: boolean;
    pesquisaTribItemFile: string;
    statusItemPesquisa: number;
    statusItemLaudo: number;
    justificativaReprovacaoLaudo: string;
    justificativaReprovacaoPesquisa: string;
    motivoAprovacaoReprovacaoLaudoId: number;
    ncm: string;
    nCMFinal: string;
    motivoAprovacaoReprovacaoPesquisaId: number;
    conteudoArteFopFile: Blob;
    conteudoArteBopfile: Blob;
    conteudoTesteLaboratorialFile: Blob;
    conteudoOutrosFile: Blob;
}

export class SolicitacaoItemToDb {
    IdSolicitacaoItem: number;
    IdSolicitacaoItemWorkflow: number;
    IdSolicitacaoWorkflow: number;
    CdSku: string;
    CdArteFOP: string;
    Descricao: string;
    CdArteBOP: string;
    Anvisa: string;
    ArteFOPFile: string;
    ArteBOPFile: string;
    TesteLaboratorialFile: string;
    OutrosFile: string;
    LaudoItem: boolean;
    LaudoItemFile: string;
    PesquisaTribItem: boolean;
    PesquisaTribItemFile: string;
    StatusItemPesquisa: number;
    StatusItemLaudo: number;
    JustificativaReprovacaoLaudo: string;
    JustificativaReprovacaoPesquisa: string;
    MotivoAprovacaoReprovacaoLaudoId: number;
    NCM: string;
    NCMFinal: string;
    MotivoAprovacaoReprovacaoPesquisaId: number;
    ConteudoArteFopFile: Blob;
    ConteudoArteBopfile: Blob;
    ConteudoTesteLaboratorialFile: Blob;
    ConteudoOutrosFile: Blob;
}

