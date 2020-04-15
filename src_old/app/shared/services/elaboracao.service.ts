import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Elaboracao, ElaboracaoToDb } from '../models/elaboracao.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ElaboracaoService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

    saveElaboracao(input: ElaboracaoToDb): Observable<Elaboracao> {
      return this.http.post<Elaboracao>(this.baseUrl + '/api/PDM/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getElaboracao(IdItem: number): Observable<Elaboracao> {
        return this.http.get<Elaboracao>(this.baseUrl + '/api/PDM/Obter?IdItem=' + IdItem);
    }
}
