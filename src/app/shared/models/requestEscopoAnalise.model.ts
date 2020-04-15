export class RequestEscopoAnalise {

    idRequestEscopoAnalise: number;
    idRequest: number;
    idEscopoAnalise: number;

}

export class RequestEscopoAnaliseToDb {
    IdRequest: number;
    Itens: RequestEscopoAnaliseItem[]
}

export class RequestEscopoAnaliseItem {
    IdRequestEscopoAnalise: number;
    IdRequest: number;
    IdEscopoAnalise: number;
}