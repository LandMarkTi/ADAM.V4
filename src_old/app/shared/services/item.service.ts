import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item, ItemToDb, StatusItem } from '../models/item.model';
import { DefinicaoElaborador } from '../models/definicaoElaborador.model';
import { ErroImportacao } from '../models/erroImportacao.model';
import { FiltroBuscaGerencial } from '../models/filtroBuscaGerencial.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
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

    saveItem(input: ItemToDb): Observable<Request> {
      return this.http.post<Request>(this.baseUrl + '/api/Item/Salvar', input, this.httpOptions);
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getItem(IdItem: number): Observable<Item> {
        return this.http.get<Item>(this.baseUrl + '/api/Item/Obter?IdItem=' + IdItem);
    }

    listItems(IdRequest: number) {
        return this.http.get(this.baseUrl + '/api/Item/Listar?IdRequest=' + IdRequest);
    }

    clienteListItems(IdRequest: number) {
        return this.http.get(this.baseUrl + '/api/Item/ListarItensAtivos?IdRequest=' + IdRequest);
    }

    listaGerencial(input: FiltroBuscaGerencial) {
        return this.http.post(this.baseUrl + '/api/Item/ListaGerencial', input, this.httpOptions);
    }

    definirStatusAtivo(IdItem: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/Item/DefinirStatusAtivo?IdItem=' + IdItem + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    verificarSKUInexistente(IdRequest: string, IdItem: string, NrSKU: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Item/verificarSKUInexistente?IdRequest=' + IdRequest + '&IdItem=' + IdItem + '&NrSKU=' + NrSKU;
        return this.http.get<boolean>(apiUrl);
    }

    obtemStatusItem(IdStatusItem): Observable<StatusItem> {
        const apiUrl = this.baseUrl + '/api/StatusItem/Obter?IdStatusItem=' + IdStatusItem;
        return this.http.get<StatusItem>(apiUrl);
    }

    carregarEntradaItens(formData: FormData): Observable<ErroImportacao[]> {
        const apiUrl = this.baseUrl + '/api/Item';
        const headers = new HttpHeaders();

        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');

        const httpOptions = { headers: headers };

        return this.http.post<ErroImportacao[]>(apiUrl + '/UploadExcel', formData, httpOptions);
    }

    defineElaborador(input: DefinicaoElaborador): Observable<number[]> {
        return this.http.post<number[]>(this.baseUrl + '/api/Item/DefinirElaborador', input, this.httpOptions);
    }

    devolver(input: DefinicaoElaborador): Observable<number[]> {
        return this.http.post<number[]>(this.baseUrl + '/api/Item/Devolver', input, this.httpOptions);
    }

    definirStatusItem(IdItem: number, IdStatusItem: number, IdUsuario: number): Observable<Item> {
        return this.http.post<Item>(this.baseUrl + '/api/Item/DefinirStatusItem?IdItem=' + IdItem + '&IdStatusItem=' + IdStatusItem + '&IdUsuario=' + IdUsuario, null);
    }

    obterItemPorIdMensagem(IdMensagem: number, IdUsuario: number): Observable<Item> {
        const apiUrl = this.baseUrl + '/api/Item/ObterItemPorIdMensagem?IdMensagem=' + IdMensagem + '&IdUsuario=' + IdUsuario;
        return this.http.get<Item>(apiUrl);
    }
}
