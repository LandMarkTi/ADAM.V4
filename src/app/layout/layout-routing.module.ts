import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'visaogerencial', pathMatch: 'prefix' },
            { path: 'requests', loadChildren: () => import('./requests/listarequests.module').then(m => m.ListaRequestsModule) },
            { path: 'itens', loadChildren: () => import('./itens/listaitens.module').then(m => m.ListaItensModule) },
            { path: 'request', loadChildren: () => import('./requests/request.module').then(m => m.RequestModule) },
            { path: 'listasolicitacao', loadChildren: () => import('./solicitacao/listasolicitacao.module').then(m => m.ListaSolicitacaoModule) },
            { path: 'solicitacaowf', loadChildren: () => import('./solicitacao/solicitacaowf.module').then(m => m.SolicitacaoWFModule) },
            { path: 'item', loadChildren: () => import('./itens/item.module').then(m => m.ItemModule) },
            // tslint:disable-next-line:max-line-length
            { path: 'listaclientes', loadChildren: () => import('./cadastros/cliente/listaclientes.module').then(m => m.ListaClientesModule) },
            { path: 'cliente', loadChildren: () => import('./cadastros/cliente/cliente.module').then(m => m.ClienteModule) },
            { path: 'listancm', loadChildren: () => import('./cadastros/ncm/listancm.module').then(m => m.ListaNcmModule) },
            { path: 'ncm', loadChildren: () => import('./cadastros/ncm/ncm.module').then(m => m.NcmModule) },
            { path: 'listanve', loadChildren: () => import('./cadastros/nve/listanve.module').then(m => m.ListaNveModule) },
            { path: 'nve', loadChildren: () => import('./cadastros/nve/nve.module').then(m => m.NveModule) },
            { path: 'listanesh', loadChildren: () => import('./cadastros/nesh/listanesh.module').then(m => m.ListaNeshModule) },
            { path: 'nesh', loadChildren: () => import('./cadastros/nesh/nesh.module').then(m => m.NeshModule) },
            { path: 'listtratadm', loadChildren: () => import('./cadastros/tratAdm/listatratAdm.module').then(m => m.ListaTratAdmModule) },
            { path: 'tratadm', loadChildren: () => import('./cadastros/tratAdm/tratAdm.module').then(m => m.TratAdmModule) },
            { path: 'listexTarif', loadChildren: () => import('./cadastros/exTarif/listaexTarif.module').then(m => m.ListaExTarifModule) },
            { path: 'exTarif', loadChildren: () => import('./cadastros/exTarif/exTarif.module').then(m => m.ExTarifModule) },
            // tslint:disable-next-line:max-line-length
            { path: 'listausuarios', loadChildren: () => import('./cadastros/usuario/listausuarios.module').then(m => m.ListaUsuariosModule) },
            { path: 'usuario', loadChildren: () => import('./cadastros/usuario/usuario.module').then(m => m.UsuarioModule) },
            // tslint:disable-next-line:max-line-length
            { path: 'visaogerencial', loadChildren: () => import('./visaogerencial/visaogerencial.module').then(m => m.VisaoGerencialModule) },
            { path: 'elaboracao', loadChildren: () => import('./elaboracao/elaboracao.module').then(m => m.ElaboracaoModule) },
            // tslint:disable-next-line:max-line-length
            { path: 'clienterequests', loadChildren: () => import('./areacliente/requests/clientelistarequests.module').then(m => m.ClienteListaRequestsModule) },
            // tslint:disable-next-line:max-line-length
            { path: 'clienterequest', loadChildren: () => import('./areacliente/requests/clienterequest.module').then(m => m.ClienteRequestModule) },
            { path: 'clienteitens', loadChildren: () => import('./areacliente/itens/clientelistaitens.module').then(m => m.ClienteListaItensModule) },
            { path: 'clienteitem', loadChildren: () => import('./areacliente/itens/clienteitem.module').then(m => m.ClienteItemModule) },
            { path: 'clientelistapendencias', loadChildren: () => import('./areacliente/pendencias/clientelistapendencias.module').then(m => m.ClienteListaPendenciasModule) },
            { path: 'clienteresposta', loadChildren: () => import('./areacliente/pendencias/clienteresposta.module').then(m => m.ClienteRespostaModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
