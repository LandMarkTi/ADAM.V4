import { Component, Input , OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
    selector: 'app-validacodigonovasenha',
    templateUrl: './validacodigonovasenha.component.html',
    styleUrls: ['./validacodigonovasenha.component.scss'],
    animations: [routerTransition()]
})

export class ValidaCodigoNovaSenhaComponent implements OnInit {
    @Input() dsEmail: string;
    usuario = new Usuario();
    msgErro: string;
    isLoadPanelVisible = false;
    cdSolicitacaoMudancaSenha: number;

    constructor(private autenticacaoService: AutenticacaoService, public router: Router, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['dsEmail'] !== null && params['dsEmail'] !== undefined && params['dsEmail'].trim() !== '') {
                this.dsEmail = params['dsEmail'];
            } else {
                this.router.navigate(['login']);
            }

        });
    }

    ngOnInit() {}

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    onFormSubmit = function(e) {

        this.autenticacaoService.verificarValidadeCdSolicitacaoMudancaSenha(
            this.dsEmail, this.cdSolicitacaoMudancaSenha).subscribe((res: boolean) => {
            if (res === null || res === undefined || res === false ) {
                this.msgErro = 'O código informado é inválido ou está expirado.';
            } else {
                this.msgErro = '';
                localStorage.setItem('cdSolicitacaoMudancaSenha', this.cdSolicitacaoMudancaSenha.toString());
                this.router.navigate(['alterasenha']);
            }
        },
        error => {
            this.errorHandler(error);
        });
        e.preventDefault();
    };

    voltarLogin() {
        this.router.navigate(['login']);
    }

}
