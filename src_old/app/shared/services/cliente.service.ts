import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente, ClienteToDb, DestinatarioToDb } from '../models/cliente.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

    // Http Headers
    httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    saveCliente(cliente: ClienteToDb): Observable<Cliente> {
        const body = JSON.stringify(cliente);

        // this.http.post(this.baseUrl + '/api/Cliente/Salvar', ClienteToDb).subscribe(res => obj = res);

      const formDataEnvio = new FormData();
      if (cliente.IdCliente !== undefined) {
          formDataEnvio.append('IdCliente', cliente.IdCliente.toString());
      }
      formDataEnvio.append('NmCliente', cliente.NmCliente);
      formDataEnvio.append('DsSigla', cliente.DsSigla);
      formDataEnvio.append('NrCNPJ', cliente.NrCNPJ);
      formDataEnvio.append('DsObservacao', cliente.DsObservacao);
      formDataEnvio.append('FlAtivo', cliente.FlAtivo.toString());

      return this.http.post<Cliente>(this.baseUrl + '/api/Cliente/SalvarForm', formDataEnvio, {headers: this.headers});
    }

    saveClienteDestinatarios(input: DestinatarioToDb): Observable<Cliente> {

      return this.http.post<Cliente>(this.baseUrl + '/api/ClienteDestinatario/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getCliente(IdCliente: number) {
        return this.http.get(this.baseUrl + '/api/Cliente/Obter?IdCliente=' + IdCliente);
    }

    listCliente(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.baseUrl + '/api/Cliente/Listar');
    }

    listarClientesAtivos(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.baseUrl + '/api/Cliente/ListarAtivos');
    }

    definirStatusAtivo(IdCliente: number, FlAtivo: boolean) {
        return this.http.post(this.baseUrl + '/api/Cliente/DefinirStatusAtivo?IdCliente=' + IdCliente + '&FlAtivo=' + FlAtivo, null);
    }

    verificarCNPJInexistente(IdCliente: string, NrCNPJ: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Cliente/VerificarCNPJInexistente?IdCliente=' + IdCliente + '&NrCNPJ=' + NrCNPJ;
        return this.http.get<boolean>(apiUrl);
    }

    verificarSiglaInexistente(IdCliente: string, Sigla: string): Observable<boolean>  {
       const apiUrl = this.baseUrl + '/api/Cliente/VerificarSiglaInexistente?IdCliente=' + IdCliente + '&DsSigla=' + Sigla;
       return this.http.get<boolean>(apiUrl);
    }

    verificarNomeInexistente(IdCliente: string, Nome: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Cliente/VerificarNomeInexistente?IdCliente=' + IdCliente + '&NmCliente=' + Nome;
        return this.http.get<boolean>(apiUrl);
    }
}
