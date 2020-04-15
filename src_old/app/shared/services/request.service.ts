import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Request, RequestToDb, StatusRequest } from '../models/request.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    saveRequest(input: RequestToDb): Observable<Request> {
      return this.http.post<Request>(this.baseUrl + '/api/Request/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getRequest(IdRequest: number): Observable<Request> {
        return this.http.get<Request>(this.baseUrl + '/api/Request/Obter?IdRequest=' + IdRequest);
    }

    listRequest() {
        return this.http.get(this.baseUrl + '/api/Request/Listar');
    }

    listRequestCliente(IdUsuario: number) {
        return this.http.get(this.baseUrl + '/api/Request/ListarCliente?IdUsuario=' + IdUsuario);
    }

    definirStatusAtivo(IdRequest: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/Request/DefinirStatusAtivo?IdRequest=' + IdRequest + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    verificarNomeInexistente(IdRequest: string, IdCliente: string, Nome: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Request/VerificarNomeInexistente?IdRequest=' + IdRequest + '&IdCliente=' + IdCliente + '&NmRequest=' + Nome;
        return this.http.get<boolean>(apiUrl);
    }

    obtemStatusRequest(IdStatusRequest): Observable<StatusRequest> {
        const apiUrl = this.baseUrl + '/api/StatusRequest/Obter?IdStatusRequest=' + IdStatusRequest;
        return this.http.get<StatusRequest>(apiUrl);
    }
}
