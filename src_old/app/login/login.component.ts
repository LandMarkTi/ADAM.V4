import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AutenticacaoService } from '../shared/services/autenticacao.service';
import { Usuario, UsuarioToDb } from '../shared/models/usuario.model';

enum PerfilAcessoEnum {
    Administrador = 1,
    Elaborador,
    Revisor,
    Cliente
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    usuario = new Usuario();
    msgErro: string;
    isLoadPanelVisible = false;

    constructor(private autenticacaoService: AutenticacaoService, public router: Router) {

    }

    ngOnInit() {}

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    onFormSubmit = function(e) {
        this.autenticacaoService.login(this.usuario.dsEmail, this.usuario.dsPassword).subscribe((res: Usuario) => {
            const usuarioLogado: Usuario = res;
            if (usuarioLogado === null) {
                this.msgErro = 'Usuário e/ou senha inválido(a).';
            } else {
                this.msgErro = '';
                localStorage.setItem('isLoggedin', 'true');
                if (usuarioLogado.idPerfilAcesso === PerfilAcessoEnum.Cliente) {
                    this.router.navigate(['clientelistapendencias']);
                } else {
                    this.router.navigate(['visaogerencial']);
                }
            }
        },
        error => {
            this.errorHandler(error);
        });
        e.preventDefault();
    };

    fogottenPws() {
        if (this.usuario.dsEmail === null || this.usuario.dsEmail === undefined || this.usuario.dsEmail.trim() === '') {
            this.msgErro = 'informe o e-mail.';
        } else {
            this.msgErro = '';
            this.autenticacaoService.buscaUsuarioPorEMail(this.usuario.dsEmail).subscribe((res: Usuario) => {
                if (res === null) {
                    this.msgErro = 'E-mail não cadastrado.';
                } else {

                    this.autenticacaoService.solicitaNovaSenha(res.idUsuario).subscribe((res1: Usuario) => {
                        this.router.navigate(['validacodigonovasenha'], { queryParams: { 'dsEmail': res1.dsEmail } } );
                    },
                    error => {
                        this.errorHandler(error);
                    });




                }
            },
            error => {
                this.errorHandler(error);
            });
        }
    }

}
