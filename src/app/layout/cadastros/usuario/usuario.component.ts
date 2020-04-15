import { NgModule } from '@angular/core';
import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario, UsuarioToDb } from '../../../shared/models/usuario.model';
import { Cliente } from '../../../shared/models/cliente.model';
import { Perfil } from '../../../shared/models/perfil.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { custom } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { analyzeFileForInjectables } from '@angular/compiler';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { PerfilService } from 'src/app/shared/services/perfil.service';
import { LanguageTranslationModule } from 'src/app/shared/modules/language-translation/language-translation.module';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';


@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss'],
    animations: [routerTransition()],
    providers: [ClienteService, UsuarioService, PerfilService]
})
export class UsuarioComponent implements OnInit {

    constructor(private perfilService: PerfilService, private usuarioService: UsuarioService, private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private autenticacaoService: AutenticacaoService) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuarioLogado = this.autenticacaoService.currentUserValue.idUsuario;
        }
    }
    @Input() idUsuario: number;
    usuario: Usuario;
    isClienteVisible = false;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    clientes: Cliente[];
    idPerfilAcesso: number;
    idCliente: number;
    perfis: Perfil[];
    isLoadPanelVisible = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    isInternalUser: boolean;
    idUsuarioLogado: number;
    senhaVerificacao: string;

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.idUsuario = params['idUsuario'];
        });

        this.carregaPerfis();
    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    carregaPerfis(): void {
        this.isLoadPanelVisible = true;
        // Carrega perfis de acesso
        this.perfilService.listPerfil()
              .subscribe(retoroListPerfil => {
                this.isLoadPanelVisible = false;
                  this.perfis = retoroListPerfil;

                  this.carregaClientes();
              },
              error => {
                  this.errorHandler(error);
              });
    }

    carregaClientes(): void {
        // Carrega clientes de acesso
        this.isLoadPanelVisible = true;
        this.clienteService.listarClientesAtivos()
              .subscribe(retoroListCliente => {
                this.isLoadPanelVisible = false;
                  this.clientes = retoroListCliente;

                  this.carregaUsuario();
              },
              error => {
                  this.errorHandler(error);
              });
    }

    carregaUsuario(): void {
        if (this.idUsuario !== undefined) {
            this.isLoadPanelVisible = true;
            this.usuarioService.getUsuario(this.idUsuario).subscribe((res: Usuario) => {
                this.isLoadPanelVisible = false;
                this.usuario = res;

                if (res.dsPassword !== null && res.dsPassword !== undefined && res.dsPassword !== '') {
                    this.senhaVerificacao = res.dsPassword;
                }

                this.idPerfilAcesso = this.usuario.idPerfilAcesso;

                const perfil = this.perfis.find( p => p.idPerfilAcesso === this.usuario.idPerfilAcesso);

                if (perfil.flUsuarioInterno === false) {
                    this.isClienteVisible = true;

                    this.idCliente = this.usuario.idCliente;
                }
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.usuario = new Usuario();
        }
    }

    gridBox_displayExpr(item) {
        return item.nmUsuario;
    }

    error(erro: string): void {
        alert(erro);
    }

    voltar(): void {
        this.router.navigate(['listausuarios']);
    }

    onFormSubmit = function(e) {
        const form = document.querySelector('form');

        const data = new FormData(form);

        const senha1 = data.get('senha') as string;
        const senha2 = data.get('senha2') as string;

        if (((senha1 !== undefined && senha1.trim() !== '') || (senha2 !== undefined && senha2.trim() !== '')) && senha1 !== senha2) {
            this.msgErroValidacao = 'As senhas não conferem.';
            this.isPopupErroVisible = true;
            return false;
        }

        const usuarioToDb: UsuarioToDb = new UsuarioToDb();
        usuarioToDb.IdUsuario = this.usuario.idUsuario;
        usuarioToDb.NmUsuario = data.get('nmUsuario') as string;
        usuarioToDb.DsEmail = data.get('dsEmail') as string;
        usuarioToDb.DsPassword = data.get('senha') as string;
        usuarioToDb.IdPerfilAcesso = this.idPerfilAcesso;

        const flUsuarioInterno = this.perfis.find(p => p.idPerfilAcesso === this.idPerfilAcesso).flUsuarioInterno;

        if (flUsuarioInterno) {
            usuarioToDb.IdCliente = null;
        } else if (this.idCliente !== undefined) {
            usuarioToDb.IdCliente = this.idCliente;
        }

        usuarioToDb.FlAtivo = true;

        let hdnIdUsuario = '';
        if (this.usuario.idUsuario !== undefined) {
            hdnIdUsuario = this.usuario.idUsuario;
        }
        const nmUsuario = data.get('nmUsuario') as string;
        const dsEmail = data.get('dsEmail') as string;

        this.isLoadPanelVisible = true;
        this.usuarioService.verificarNomeInexistente(hdnIdUsuario, nmUsuario)
        .subscribe(retornoNome => {
            this.isLoadPanelVisible = false;
          if (!retornoNome) {
              this.msgErroValidacao = 'Nome já utilizado.';
              this.isPopupErroVisible = true;
              return false;
          } else {
            this.isLoadPanelVisible = true;
              this.usuarioService.verificarEmailInexistente(hdnIdUsuario, dsEmail)
              .subscribe(retoroEmail => {
                this.isLoadPanelVisible = false;
                  if (!retoroEmail) {
                    this.msgErroValidacao = 'Email já utilizado.';
                    this.isPopupErroVisible = true;
                      return false;
                  } else {
                    this.isLoadPanelVisible = true;
                    this.usuarioService.saveUsuario(usuarioToDb).subscribe(retoroSalvar => {
                        this.isLoadPanelVisible = false;
                        this.isPopupVisible = true;
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
        });
        e.preventDefault();
    };


    fecharSucesso(): void {
        this.isPopupVisible = false;
    }

    fecharErro(): void {
        this.isPopupErroVisible = false;
    }

    popup_hidden(e): void {
        this.router.navigate(['listausuarios']);
    }

    passwordsIguais(e): boolean {

        return false;
    }

    onValueChanged (e) {

        if (e.value !== undefined) {
            const idPerfil = e.value;

            this.isClienteVisible = true;

            const flUsuarioInterno = this.perfis.find(p => p.idPerfilAcesso === idPerfil).flUsuarioInterno;

            if (flUsuarioInterno) {
                this.isClienteVisible = false;
            } else {
                this.isClienteVisible = true;
            }
        }
    }
}

