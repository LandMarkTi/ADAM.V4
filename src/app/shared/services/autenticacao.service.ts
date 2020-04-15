import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioToDb } from '../models/usuario.model';

enum PerfilAcessoEnum {
    Administrador = 1,
    Elaborador,
    Revisor,
    Cliente
}

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
    private currentUserSubject: BehaviorSubject<Usuario>;
    public currentUser: Observable<Usuario>;
    baseUrl = environment.baseUrl;

    httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario {
        return this.currentUserSubject.value;
    }

    login(DsEmail: string, DsPassword: string): Observable<Usuario> {
        return this.http.post<Usuario>(this.baseUrl + '/api/Usuario/AutenticarUsuario?DsEmail=' + DsEmail + '&DsPassword=' + DsPassword, null)
        .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isInternalUser(): boolean {
        let retorno = false;

        const usuario = this.currentUserSubject.value;

        if (usuario !== null && usuario.idPerfilAcesso !== PerfilAcessoEnum.Cliente) {
            retorno = true;
        }

        return retorno;
    }

    isIAdministratorUser(): boolean {
        let retorno = false;

        const usuario = this.currentUserSubject.value;

        if (usuario !== null && usuario.idPerfilAcesso === PerfilAcessoEnum.Administrador) {
            retorno = true;
        }

        return retorno;
    }

    buscaUsuarioPorEMail(dsEmail: string): Observable<Usuario> {
        const apiUrl = this.baseUrl + '/api/Usuario/buscaUsuarioPorEMail?dsEmail=' + dsEmail;
        return this.http.get<Usuario>(apiUrl);
    }

    solicitaNovaSenha(IdUSuario: number): Observable<Usuario> {
        const apiUrl = this.baseUrl + '/api/Usuario/SolicitaNovaSenha?IdUSuario=' + IdUSuario;
        return this.http.post<Usuario>(apiUrl, null)
        .pipe(map(res => {
                return res;
            }));
    }

    atualizaSenha(CdSolicitacaoMudancaSenha: number, DsPassword: string): Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + '/api/Usuario/AtualizaSenha?CdSolicitacaoMudancaSenha=' + CdSolicitacaoMudancaSenha + '&DsPassword=' + DsPassword, null)
        .pipe(map(res => {
                return res;
            }));
    }

    verificarValidadeCdSolicitacaoMudancaSenha(DsEmail: string, CdSolicitacaoMudancaSenha: number): Observable<boolean> {
        const apiUrl = this.baseUrl + '/api/Usuario/VerificarValidadeCdSolicitacaoMudancaSenha?DsEmail=' + DsEmail + '&CdSolicitacaoMudancaSenha=' + CdSolicitacaoMudancaSenha;
        return this.http.get<boolean>(apiUrl);
    }

}
