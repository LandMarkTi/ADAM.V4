import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExTarif, ExTarifToDb, ExTarifElaboracao, ExTarifElaboracaoToDb } from '../models/exTarif.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExTarifService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

    saveExTarif(input: ExTarifToDb): Observable<ExTarif> {
      return this.http.post<ExTarif>(this.baseUrl + '/api/ExTarif/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getExTarif(IdExTarif: number): Observable<ExTarif> {
        return this.http.get<ExTarif>(this.baseUrl + '/api/ExTarif/Obter?IdExTarif=' + IdExTarif);
    }

    ListarExTarifDoItem(IdItem: number): Observable<ExTarif[]> {
        return this.http.get<ExTarif[]>(this.baseUrl + '/api/ExTarif/ListarExTarifDoItem?IdItem=' + IdItem);
    }

    ListarExTarifDaElaboracao(IdNCM: number, IdItem: number): Observable<ExTarifElaboracao[]> {
        return this.http.get<ExTarifElaboracao[]>(this.baseUrl + '/api/ExTarif/ListarExTarifDaElaboracao?IdNCM=' + IdNCM + '&IdItem=' + IdItem);
    }

    listExTarif() {
        return this.http.get(this.baseUrl + '/api/ExTarif/Listar');
    }

    definirStatusAtivo(IdExTarif: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/ExTarif/DefinirStatusAtivo?IdExTarif=' + IdExTarif + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    VerificarNCMInexistente(IdExTarif: string, IdNCM: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/ExTarif/VerificarNCMInexistente?IdExTarif=' + IdExTarif + '&IdNCM=' + IdNCM;
        return this.http.get<boolean>(apiUrl);
    }

    salvarExTarifElaboracao(input: ExTarifElaboracaoToDb): Observable<ExTarifElaboracaoToDb> {
        return this.http.post<ExTarifElaboracaoToDb>(this.baseUrl + '/api/ExTarif/SalvarExTarifElaboracao', input, {headers: this.headers});
    }
}
