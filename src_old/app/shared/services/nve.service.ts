import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Nve, NveToDb, NveElaboracao, NveElaboracaoToDb } from '../models/nve.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NveService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  baseUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

    saveNve(input: NveToDb): Observable<Nve> {
      return this.http.post<Nve>(this.baseUrl + '/api/Nve/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getNve(IdNVE: number): Observable<Nve> {
        return this.http.get<Nve>(this.baseUrl + '/api/Nve/Obter?IdNVE=' + IdNVE);
    }

    ListarNveDoItem(IdItem: number): Observable<Nve[]> {
        return this.http.get<Nve[]>(this.baseUrl + '/api/Nve/ListarNveDoItem?IdItem=' + IdItem);
    }

    ListarNVEDaElaboracao(IdNCM: number, IdItem: number): Observable<NveElaboracao[]> {
        return this.http.get<NveElaboracao[]>(this.baseUrl + '/api/Nve/ListarNVEDaElaboracao?IdNCM=' + IdNCM + '&IdItem=' + IdItem);
    }

    listNve() {
        return this.http.get(this.baseUrl + '/api/Nve/Listar');
    }

    definirStatusAtivo(IdNVE: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/Nve/DefinirStatusAtivo?IdNVE=' + IdNVE + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    VerificarNCMInexistente(IdNVE: string, IdNCM: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Nve/VerificarNCMInexistente?IdNVE=' + IdNVE + '&IdNCM=' + IdNCM;
        return this.http.get<boolean>(apiUrl);
    }

    salvarNveElaboracao(input: NveElaboracaoToDb): Observable<NveElaboracaoToDb> {
        return this.http.post<NveElaboracaoToDb>(this.baseUrl + '/api/Nve/SalvarNveElaboracao', input, {headers: this.headers});
    }
}
