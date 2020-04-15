import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { TipoLaudos } from '../models/tipoLaudos.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { Solicitacao } from '../models/solicitacao.model';
import { SolicitacaoItem } from '../models/solicitacaoItem.model';
import { ErroCargaItensSolicitacao } from '../models/erroCargaItensSolicitacao.model';

@Injectable({
    providedIn: 'root'
})
export class SolicitacaoService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    criaSolicitacaoFromADAM(formData: FormData): Observable<Solicitacao> {
        const apiUrl = this.baseUrl;
        const headers = new HttpHeaders();

        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');

        const httpOptions = { headers: headers };

        return this.http.post<Solicitacao>(apiUrl + '/api/Solicitacao/CriaSolicitacaoFromADAM', formData, httpOptions);
    }

    obterSolicitacao(IdSolicitacao: number): Observable<Solicitacao> {
        return this.http.get<Solicitacao>(this.baseUrl + '/api/Solicitacao/Obter?IdSolicitacao=' +  IdSolicitacao + '&ComConteudoArquivos=false');
    }

  DownloadFile(IdSolicitacao: number, IdMalhaLogisticaEntradaSaida: number): Observable<HttpEvent<Blob>> {
      return this.http.request(new HttpRequest(
        'GET',
        this.baseUrl + '/api/Solicitacao/DownloadFile?IdSolicitacao=' + IdSolicitacao + '&IdMalhaLogisticaEntradaSaida=' + IdMalhaLogisticaEntradaSaida,
        null,
        {
          reportProgress: true,
          responseType: 'blob'
        }));
  }

  DownloadFileItem(IdSolicitacaoItem: number, IdMalhaLogisticaEntradaSaida: number): Observable<HttpEvent<Blob>> {
    return this.http.request(new HttpRequest(
      'GET',
      this.baseUrl + '/api/SolicitacaoItem/DownloadFile?IdSolicitacaoItem=' + IdSolicitacaoItem + '&IdMalhaLogisticaEntradaSaida=' + IdMalhaLogisticaEntradaSaida,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }));
}

  carregarEntradaItens(formData: FormData): Observable<ErroCargaItensSolicitacao[]> {

        const headers = new HttpHeaders();

        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');

        const httpOptions = { headers: headers };

        return this.http.post<ErroCargaItensSolicitacao[]>(this.baseUrl + '/api/SolicitacaoItem/UploadExcel', formData, httpOptions);
    }

  listItems(IdSolicitacao: number): Observable<SolicitacaoItem[]> {
    return this.http.get<SolicitacaoItem[]>(this.baseUrl + '/api/SolicitacaoItem/ListarItens?IdSolicitacao=' +  IdSolicitacao);
  }

  obterItem(IdSolicitacaoItem: number): Observable<SolicitacaoItem> {
    return this.http.get<SolicitacaoItem>(this.baseUrl + '/api/SolicitacaoItem/ObterItem?IdSolicitacaoItem=' +  IdSolicitacaoItem);
  }

  listSolicitacoes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.baseUrl + '/api/Solicitacao/Listar');
  }

}
