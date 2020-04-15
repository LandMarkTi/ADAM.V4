import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Perfil } from '../models/perfil.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
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

    getPerfil(IdPerfil: number): Observable<Perfil> {
        return this.http.get<Perfil>(this.baseUrl + '/api/PerfilAcesso/Obter?IdPerfil=' + IdPerfil);
    }

    listPerfil(): Observable<Perfil []> {
        return this.http.get<Perfil[]>(this.baseUrl + '/api/PerfilAcesso/Listar');
    }

}
