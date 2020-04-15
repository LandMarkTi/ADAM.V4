import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestEscopoAnalise, RequestEscopoAnaliseToDb } from '../models/requestEscopoAnalise.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RequestEscopoAnaliseService {
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

    saveRequestEscopoAnalise(input: RequestEscopoAnaliseToDb): Observable<Request> {
        return this.http.post<Request>(this.baseUrl + '/api/RequestEscopoAnalise/Salvar', input, {headers: this.headers});
    }

    getRequestEscopoAnalise(IdEscopoAnalise: number, IdRequest: number ) {
        return this.http.get(this.baseUrl + '/api/RequestEscopoAnalise/Obter?IdEscopoAnalise=' + IdEscopoAnalise + '&IdRequest=' + IdRequest);
    }

    listRequestEscopoAnalise(IdRequest: number): Observable <RequestEscopoAnalise[]> {
        return this.http.get<RequestEscopoAnalise[]>(this.baseUrl + '/api/RequestEscopoAnalise/Listar?IdRequest=' + IdRequest);
    }

}
