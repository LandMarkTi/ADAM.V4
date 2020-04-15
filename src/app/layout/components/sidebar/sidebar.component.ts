import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { Usuario } from 'src/app/shared/models/usuario.model';

enum PerfilAcessoEnum {
    Administrador = 1,
    Elaborador,
    Revisor,
    Cliente
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    isAdministrator: boolean;
    isInternalUser: boolean;

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private autenticacaoService: AutenticacaoService, private translate: TranslateService, public router: Router) {

        this.isAdministrator = autenticacaoService.currentUserValue.idPerfilAcesso === PerfilAcessoEnum.Administrador;

        this.isInternalUser = autenticacaoService.currentUserValue.idPerfilAcesso !== PerfilAcessoEnum.Cliente;

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
    }


    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
}
