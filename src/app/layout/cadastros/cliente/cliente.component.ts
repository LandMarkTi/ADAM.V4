import { NgModule } from '@angular/core';
import { Component, Input , OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ClienteService } from '../../../shared/services/cliente.service';
import { Cliente, ClienteToDb, DestinatarioToDb, Email } from '../../../shared/models/cliente.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { custom } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { analyzeFileForInjectables } from '@angular/compiler';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
    animations: [routerTransition()],
    providers: [ClienteService]
})
export class ClienteComponent implements OnInit {
    @Input() idCliente: number;
    cliente: Cliente;
    isPopupVisible = false;
    isPopupErroVisible = false;
    msgErroValidacao = '';
    isLoadPanelVisible = false;
    isInternalUser: boolean;
    idUsuario: number;
    destroy$: Subject<boolean> = new Subject<boolean>();
    

    constructor(private autenticacaoService: AutenticacaoService, private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient) {
        this.isInternalUser = this.autenticacaoService.isIAdministratorUser();

        if (!this.isInternalUser) {
            this.router.navigate(['login']);
        } else {
            this.idUsuario = this.autenticacaoService.currentUserValue.idUsuario;
        }

        this.activatedRoute.queryParams.subscribe(params => {
            this.idCliente = params['idCliente'];
        });

        if (this.idCliente !== undefined) {
            this.isLoadPanelVisible = true;
            this.clienteService.getCliente(this.idCliente).pipe(takeUntil(this.destroy$)).subscribe((res: Cliente) => {
                this.cliente = res;
                this.isLoadPanelVisible = false;
            },
            error => {
                this.errorHandler(error);
            });
        } else {
            this.cliente = new Cliente();
            this.isLoadPanelVisible = false;
        }

    }

    ngOnInit() {


    }

    errorHandler(erro: any) {
        this.isLoadPanelVisible = false;
        alert('Ocorreu o seguinte erro: ' + erro.message);
    }

    validaCNPJ(e): boolean {

        let retorno = true;
        let cnpj = e.value;

        if (cnpj.trim() === '') {
            retorno = true;
        } else {
            cnpj = cnpj.replace(/[^\d]+/g, '');

            if (cnpj === '') {
                retorno = false;
            }

            if (cnpj.length !== 14) {
                retorno = false;
            }

            // Elimina CNPJs invalidos conhecidos
            if (cnpj === '00000000000000' ||
                cnpj === '11111111111111' ||
                cnpj === '22222222222222' ||
                cnpj === '33333333333333' ||
                cnpj === '44444444444444' ||
                cnpj === '55555555555555' ||
                cnpj === '66666666666666' ||
                cnpj === '77777777777777' ||
                cnpj === '88888888888888' ||
                cnpj === '99999999999999') {
                    retorno = false;
                }

            // Valida DVs
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0, tamanho);
            const digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += Number(numeros.charAt(tamanho - i)) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== Number(digitos.charAt(0))) {
                retorno = false;
            }

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
            soma += Number(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== Number(digitos.charAt(1))) {
                retorno = false;
            }
        }

        return retorno;
    }

    verificarNomeInexistente(): boolean {
        let retorno = false;

        const form = document.querySelector('form');

        const data = new FormData(form);
        const hdnIdCliente = data.get('hdnIdCliente') as string;
        const nmCliente = data.get('nmCliente') as string;

        this.clienteService.verificarNomeInexistente(hdnIdCliente, nmCliente)
        .pipe(takeUntil(this.destroy$)).subscribe((res: boolean) => {
            retorno = res;
        });
        return retorno;
    }

    error(erro: string): void {
        alert(erro);
    }

    goToPage(url: string): void {
        window.location.href = url;
    }

    onFormSubmit = function(e) {

        const form = document.querySelector('form');

        const data = new FormData(form);

        const clienteToDb: ClienteToDb = new ClienteToDb();
        clienteToDb.IdCliente = this.cliente.idCliente;
        clienteToDb.DsSigla = data.get('dsSigla') as string;
        clienteToDb.DsSigla = clienteToDb.DsSigla.toUpperCase();
        clienteToDb.NmCliente = data.get('nmCliente') as string;
        clienteToDb.NrCNPJ = this.mascaraCnpj(data.get('nrCNPJ') as string);
        clienteToDb.DsObservacao = data.get('dsObservacao') as string;
        clienteToDb.FlAtivo = true;

        const hdnIdCliente = data.get('hdnIdCliente') as string;
        const dsSigla = data.get('dsSigla') as string;
        const nrCNPJ = this.mascaraCnpj(data.get('nrCNPJ') as string);

        this.isLoadPanelVisible = true;
        this.clienteService.verificarSiglaInexistente(hdnIdCliente, dsSigla)
        .subscribe(retornoSigla => {
          if (!retornoSigla) {
              this.isLoadPanelVisible = false;
              this.msgErroValidacao = 'Sigla já utilizada.';
              this.isPopupErroVisible = true;
              return false;
          } else {
              this.isLoadPanelVisible = true;
              this.clienteService.verificarCNPJInexistente(hdnIdCliente, nrCNPJ)
              .subscribe(retoroCNPJ => {
                this.isLoadPanelVisible = false;
                  if (!retoroCNPJ) {
                    this.msgErroValidacao = 'CNPJ já utilizado.';
                    this.isPopupErroVisible = true;
                      return false;
                  } else {
                      this.isLoadPanelVisible = true;
                      this.clienteService.saveCliente(clienteToDb).subscribe(retoroSalvar => {
                          this.isLoadPanelVisible = false;
                          const idRetorno: number = retoroSalvar.idCliente;

                          const input: DestinatarioToDb = new DestinatarioToDb();
                          input.IdCliente = idRetorno;

                          for (let i = 0, len = this.cliente.destinatarios.length; i < len; i++) {
                            const email: Email = new Email();
                            email.IdCliente = idRetorno;
                            email.DsEmail = this.cliente.destinatarios[i].dsEmail;
                            email.NmDestinatario = this.cliente.destinatarios[i].nmDestinatario;
                            email.FlAtivo = true;
                            input.Destinatarios.push(email);
                          }

                          this.clienteService.saveClienteDestinatarios(input).subscribe(retoroSalvarDEstinatario => {
                            this.isPopupVisible = true;
                          },
                          error => {
                              this.errorHandler(error);
                          });
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
        },
        error => {
            this.errorHandler(error);
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
        this.router.navigate(['listaclientes']);
    }

     mascaraCnpj(valor: string): string {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
    }

    mascaraCNPJ(entrada: string): string {

        if (entrada.length <= 14) {

            // Coloca ponto entre o segundo e o terceiro dígitos
            entrada = entrada.replace(/^(\d{2})(\d)/, '$1.$2');

            // Coloca ponto entre o quinto e o sexto dígitos
            entrada = entrada.replace(/^(\d{2})\.(\d{3})(\d)/, '$1 $2 $3');

            // Coloca uma barra entre o oitavo e o nono dígitos
            entrada = entrada.replace(/\.(\d{3})(\d)/, '.$1/$2');

            // Coloca um hífen depois do bloco de quatro dígitos
            entrada = entrada.replace(/(\d{4})(\d)/, '$1-$2');
        }
        return entrada;
    }
    deletar(e, data) {
        this.cliente.destinatarios.splice(data.row.dataIndex, 1);
    }
}

