import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mensagem, MensagemToDb} from '../models/mensagem.model';
import { ErroImportacao } from '../models/erroImportacao.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MensagemPendente } from '../../shared/models/mensagemPendente.model';
import { RespostaCliente, RespostaClienteToDb } from '../../shared/models/respostaCliente.model';
@Injectable({
    providedIn: 'root'
})
export class MensagemService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  httpOptions1 = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    saveMensagem(input: MensagemToDb): Observable<Mensagem> {
      return this.http.post<Mensagem>(this.baseUrl + '/api/MensagemElaboracao/Salvar', input, this.httpOptions);
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getMensagem(IdMensagemElaboracao: number): Observable<Mensagem> {
        return this.http.get<Mensagem>(this.baseUrl + '/api/MensagemElaboracao/Obter?IdMensagemElaboracao=' + IdMensagemElaboracao);
    }

    getMensagemParaCliente(IdMensagemElaboracao: number, IdUsuario: number): Observable<Mensagem> {
      // tslint:disable-next-line:max-line-length
      return this.http.get<Mensagem>(this.baseUrl + '/api/MensagemElaboracao/ObterMensagemParaCliente?IdMensagemElaboracao=' + IdMensagemElaboracao + '&IdUsuario=' + IdUsuario);
    }

    listMensagens(IdItem: number) {
        return this.http.get(this.baseUrl + '/api/MensagemElaboracao/Listar?IdItem=' + IdItem);
    }

    listarPendenciasCliente(IdUsuario: number): Observable<MensagemPendente[]>  {
      return this.http.get<MensagemPendente[]>(this.baseUrl + '/api/MensagemElaboracao/ListarPendenciasCliente?IdUsuario=' + IdUsuario);
    }

    responderMensagemDoElaborador(input: RespostaClienteToDb): Observable<RespostaCliente> {
      return this.http.post<RespostaCliente>(this.baseUrl + '/api/MensagemElaboracao/ResponderMensagemDoElaborador', input, this.httpOptions);
    }

    listarHistoricoMensagemItem(IdUsuario: number, IdItem: number): Observable<Mensagem[]> {
      return this.http.post<Mensagem[]>(this.baseUrl + '/api/MensagemElaboracao/ListarHistoricoMensagemItem?IdUsuario=' + IdUsuario + '&IdItem=' + IdItem , null, this.httpOptions);
    }

    obterRespostaDaMensagemElaboracao(IdUsuario: number, IdMensagemPai: number, ): Observable<RespostaCliente> {
      // tslint:disable-next-line:max-line-length
      return this.http.get<RespostaCliente>(this.baseUrl + '/api/MensagemElaboracao/ObterRespostaDaMensagemElaboracao?IdUsuario=' + IdUsuario + '&IdMensagemPai=' + IdMensagemPai);
    }
}
