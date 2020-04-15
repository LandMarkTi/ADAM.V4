import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ncm, NcmToDb } from '../models/ncm.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NcmService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

    saveNcm(input: NcmToDb): Observable<Ncm> {
      return this.http.post<Ncm>(this.baseUrl + '/api/Ncm/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getNcm(IdNCM: number): Observable<Ncm> {
        return this.http.get<Ncm>(this.baseUrl + '/api/Ncm/Obter?IdNCM=' + IdNCM);
    }

    getNcmByCode(CdNCM: string): Observable<Ncm> {
        return this.http.get<Ncm>(this.baseUrl + '/api/Ncm/ObterPorCodigo?CdNCM=' + CdNCM);
    }

    getNcmBy4CharsCode(CdNCM: string): Observable<Ncm> {
        return this.http.get<Ncm>(this.baseUrl + '/api/Ncm/ObterPorCodigo4Caracteres?CdNCM=' + CdNCM);
    }

    listNcm() {
        return this.http.get(this.baseUrl + '/api/Ncm/Listar');
    }

    listNcmAtivos() {
        return this.http.get(this.baseUrl + '/api/Ncm/ListarAtivos');
    }

    definirStatusAtivo(IdNCM: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/Ncm/DefinirStatusAtivo?IdNCM=' + IdNCM + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    verificarCodigoInexistente(IdNCM: string, Codigo: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Ncm/VerificarCodigoInexistente?IdNCM=' + IdNCM + '&CdNCM=' + Codigo;
        return this.http.get<boolean>(apiUrl);
    }
}
