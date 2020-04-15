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
    selector: 'app-alterasenha',
    templateUrl: './alterasenha.component.html',
    styleUrls: ['./alterasenha.component.scss'],
    animations: [routerTransition()]
})


export class AlteraSenhaComponent implements OnInit {
usuario = new Usuario();
msgErro: string;
isLoadPanelVisible = false;
isPopupVisible = false;
isPopupErroVisible = false;
pwdCheck = '';
msgErroValidacao: string;

constructor(private autenticacaoService: AutenticacaoService, public router: Router) {
    // tslint:disable-next-line:max-line-length
    if (
        localStorage.getItem('cdSolicitacaoMudancaSenha') === null
        ||
        localStorage.getItem('cdSolicitacaoMudancaSenha') === undefined
        ||
        localStorage.getItem('cdSolicitacaoMudancaSenha').trim() === ''
        ) {
        this.router.navigate(['login']);
    }
}

ngOnInit() {}

fecharSucesso(): void {
    this.isPopupVisible = false;
}

fecharErro(): void {
    this.isPopupErroVisible = false;
}

popup_hidden(e): void {
    this.router.navigate(['login']);
}

errorHandler(erro: any) {
    this.isLoadPanelVisible = false;
    alert('Ocorreu o seguinte erro: ' + erro.message);
}

cancelarAlteracao() {
    localStorage.removeItem('cdSolicitacaoMudancaSenha');
    this.router.navigate(['login']);
}

onFormSubmit = function(e) {
    e.preventDefault();
    if (this.usuario.dsPassword !== this.pwdCheck) {
        this.msgErroValidacao = 'As senhas digitadas não conferem. Por favor, redigite-as.';
        this.isPopupErroVisible = true;
        return;
    }

    this.autenticacaoService.atualizaSenha(
        localStorage.getItem('cdSolicitacaoMudancaSenha'), this.usuario.dsPassword).subscribe((res: boolean) => {
            localStorage.removeItem('cdSolicitacaoMudancaSenha');
            this.isPopupVisible = true;
    }, error => {
        this.errorHandler(error);
    });

};



}
