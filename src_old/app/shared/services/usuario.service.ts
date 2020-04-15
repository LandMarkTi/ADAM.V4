import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario, UsuarioToDb } from '../models/usuario.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

     // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    saveUsuario(usuario: UsuarioToDb): Observable<Usuario> {
      const formDataEnvio = new FormData();
      if (usuario.IdUsuario !== undefined) {
          formDataEnvio.append('IdUsuario', usuario.IdUsuario.toString());
      }
      formDataEnvio.append('NmUsuario', usuario.NmUsuario);
      formDataEnvio.append('DsEmail', usuario.DsEmail);
      formDataEnvio.append('DsPassword', usuario.DsPassword);
      formDataEnvio.append('FlAtivo', usuario.FlAtivo.toString());
      formDataEnvio.append('IdPerfilAcesso', usuario.IdPerfilAcesso.toString());

      if (usuario.IdCliente !== null) {
        formDataEnvio.append('IdCliente', usuario.IdCliente.toString());
      }

      return this.http.post<Usuario>(this.baseUrl + '/api/Usuario/SalvarForm', formDataEnvio, {headers: this.headers});
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getUsuario(IdUsuario: number): Observable<Usuario> {
        return this.http.get<Usuario>(this.baseUrl + '/api/Usuario/Obter?IdUsuario=' + IdUsuario);
    }

    listUsuario() {
        return this.http.get(this.baseUrl + '/api/Usuario/Listar');
    }

    listarUsuariosUYAtivos(): Observable<Usuario[]> {
      return this.http.get<Usuario[]>(this.baseUrl + '/api/Usuario/ListarUsuariosUYAtivos');
  }

    definirStatusAtivo(IdUsuario: number, FlAtivo: boolean) {
        return this.http.post(this.baseUrl + '/api/Usuario/DefinirStatusAtivo?IdUsuario=' + IdUsuario + '&FlAtivo=' + FlAtivo, null);
    }

    verificarEmailInexistente(IdUsuario: string, DsEmail: string): Observable<boolean>  {
       const apiUrl = this.baseUrl + '/api/Usuario/VerificarEmailInexistente?IdUsuario=' + IdUsuario + '&DsEmail=' + DsEmail;
       return this.http.get<boolean>(apiUrl);
    }

    verificarNomeInexistente(IdUsuario: string, Nome: string): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Usuario/VerificarNomeInexistente?IdUsuario=' + IdUsuario + '&NmUsuario=' + Nome;
        return this.http.get<boolean>(apiUrl);
    }
}
