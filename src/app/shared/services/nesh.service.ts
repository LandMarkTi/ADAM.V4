import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Nesh, NeshToDb } from '../models/nesh.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IfStmt } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})
export class NeshService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

    saveNesh(input: NeshToDb): Observable<Nesh> {
      return this.http.post<Nesh>(this.baseUrl + '/api/Nesh/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getNesh(IdNesh: number): Observable<Nesh> {
        return this.http.get<Nesh>(this.baseUrl + '/api/Nesh/Obter?IdNesh=' + IdNesh);
    }

    getNeshByNCM(CdNCM: string): Observable<Nesh> {

        if (CdNCM.length > 4) {
            CdNCM = CdNCM.substring(0, 4);
        }

        return this.http.get<Nesh>(this.baseUrl + '/api/Nesh/ObterPorNCM?CdNCM=' + CdNCM);
    }

    listNesh() {
        return this.http.get(this.baseUrl + '/api/Nesh/Listar');
    }

    definirStatusAtivo(IdNesh: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/Nesh/DefinirStatusAtivo?IdNesh=' + IdNesh + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    VerificarNCMInexistente(IdNesh: string, CdNCM: string): Observable<boolean> {
        if (CdNCM.length > 4) {
            CdNCM = CdNCM.substring(0, 4);
        }

        const apiUrl = this.baseUrl + '/api/Nesh/VerificarNCMInexistente?IdNesh=' + IdNesh + '&CdNCM=' + CdNCM;
        return this.http.get<boolean>(apiUrl);
    }
}
