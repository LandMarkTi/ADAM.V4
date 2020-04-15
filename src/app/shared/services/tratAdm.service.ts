import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TratAdm, TratAdmToDb, TratAdmElaboracao, TratAdmElaboracaoToDb} from '../models/tratAdm.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TratAdmService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

    saveTratAdm(input: TratAdmToDb): Observable<TratAdm> {
      return this.http.post<TratAdm>(this.baseUrl + '/api/TratAdm/Salvar', input, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getTratAdm(IdTratamentoAdministrativo: number): Observable<TratAdm> {
        return this.http.get<TratAdm>(this.baseUrl + '/api/TratAdm/Obter?IdTratamentoAdministrativo=' + IdTratamentoAdministrativo);
    }

    ListarTratAdmDoItem(IdItem: number): Observable<TratAdm[]> {
        return this.http.get<TratAdm[]>(this.baseUrl + '/api/TratAdm/ListarTratAdmDoItem?IdItem=' + IdItem);
    }

    ListarTratAdmDaElaboracao(IdNCM: number, IdItem: number): Observable<TratAdmElaboracao[]> {
        return this.http.get<TratAdmElaboracao[]>(this.baseUrl + '/api/TratAdm/ListarTratAdmDaElaboracao?IdNCM=' + IdNCM + '&IdItem=' + IdItem);
    }

    listTratAdm() {
        return this.http.get(this.baseUrl + '/api/TratAdm/Listar');
    }

    definirStatusAtivo(IdTratamentoAdministrativo: number, FlAtivo: boolean) {
        const apiUrl = this.baseUrl + '/api/TratAdm/DefinirStatusAtivo?IdTratamentoAdministrativo=' + IdTratamentoAdministrativo + '&FlAtivo=' + FlAtivo;
        return this.http.post(apiUrl, null);
    }

    VerificarNCMInexistente(IdTratamentoAdministrativo: string, IdNCM: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/TratAdm/VerificarNCMInexistente?IdTratamentoAdministrativo=' + IdTratamentoAdministrativo + '&IdNCM=' + IdNCM;
        return this.http.get<boolean>(apiUrl);
    }

    salvarTratAdmElaboracao(input: TratAdmElaboracaoToDb): Observable<TratAdmElaboracaoToDb> {
        return this.http.post<TratAdmElaboracaoToDb>(this.baseUrl + '/api/TratAdm/SalvarTratAdmElaboracao', input, {headers: this.headers});
    }
}
