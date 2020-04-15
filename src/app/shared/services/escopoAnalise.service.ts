import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EscopoAnalise } from '../models/escopoAnalise.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EscopoAnaliseService {
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

    getEscopoAnalise(IdEscopoAnalise: number) {
        return this.http.get(this.baseUrl + '/api/EscopoAnalise/Obter?IdEscopoAnalise=' + IdEscopoAnalise);
    }

    listEscopoAnalise(): Observable<EscopoAnalise[]> {
        return this.http.get<EscopoAnalise[]>(this.baseUrl + '/api/EscopoAnalise/Listar');
    }

    listarEscopoAnaliseAtivos(): Observable<EscopoAnalise[]> {
        return this.http.get<EscopoAnalise[]>(this.baseUrl + '/api/EscopoAnalise/ListarAtivos');
    }

    listarEscoposDoRequest(IdRequest: number): Observable<EscopoAnalise[]> {
        return this.http.get<EscopoAnalise[]>(this.baseUrl + '/api/EscopoAnalise/ListarEscoposDoRequest?IdRequest=' + IdRequest);
    }

    ListarSomeneteEscoposDoRequest(IdRequest: number): Observable<EscopoAnalise[]> {
        return this.http.get<EscopoAnalise[]>(this.baseUrl + '/api/EscopoAnalise/ListarSomeneteEscoposDoRequest?IdRequest=' + IdRequest);
    }
}
