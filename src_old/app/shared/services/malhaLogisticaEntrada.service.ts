import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MalhaLogisticaEntrada } from '../models/malhaLogisticaEntrada.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MalhaLogisticaEntradaService {
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

    listaMalhaLogisticaEntrada(): Observable <MalhaLogisticaEntrada[]> {
        return this.http.get<MalhaLogisticaEntrada[]>(this.baseUrl + '/api/MalhaLogisticaEntrada/Listar');
    }

}
