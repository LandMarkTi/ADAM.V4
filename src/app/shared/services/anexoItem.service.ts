import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { AnexoItem, AnexoItemToDb } from '../models/anexoItem.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AnexoItemService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  httpOptions1 = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
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

    listAnexosItem(IdItem: number, IdMensagemElaboracao: string) {
        return this.http.get(this.baseUrl + '/api/AnexoItem/ListarAnexosItem?IdItem=' + IdItem +
        '&IdMensagemElaboracao=' + IdMensagemElaboracao);
    }

    uploadArquivoDoItem(formData: FormData): Observable<AnexoItem> {
        const apiUrl = this.baseUrl;
        const headers = new HttpHeaders();

        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');

        const httpOptions = { headers: headers };

        return this.http.post<AnexoItem>(apiUrl + '/api/AnexoItem/UploadArquivoDoItem', formData, httpOptions);
    }

    public DownloadFile(filePath: string): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
          'GET',
          this.baseUrl + '/api/AnexoItem/DownloadFile?fileName=' + filePath,
          null,
          {
            reportProgress: true,
            responseType: 'blob'
          }));
    }




}
