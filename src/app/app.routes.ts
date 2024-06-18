import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { GuardarusuarioComponent } from './components/guardarusuario/guardarusuario.component';
import { authGuard } from './utils/auth.guard';

import { RequerimientoViaticosListComponent } from './components/requerimiento_viaticos/requerimiento-viaticos-list/requerimiento-viaticos-list.component';
import { RequerimientoViaticosFormComponent } from './components/requerimiento_viaticos/requerimiento-viaticos-form/requerimiento-viaticos-form.component';
import { CajaChicaListComponent } from './components/caja_chica/caja-chica-list/caja-chica-list.component';
import { CajaChicaFormComponent } from './components/caja_chica/caja-chica-form/caja-chica-form.component';

import { RequerimientoViaticosFormEditComponent } from './components/requerimiento_viaticos/requerimiento-viaticos-form-edit/requerimiento-viaticos-form-edit.component';
import { SolicitudCajaChicaListComponent } from './components/solicitud_caja_chica/solicitud-caja-chica-list/solicitud-caja-chica-list.component';
import { SolicitudCajaChicaFormComponent } from './components/solicitud_caja_chica/solicitud-caja-chica-form/solicitud-caja-chica-form.component';
import { CajaEgresosListComponent } from './components/caja_egresos/caja-egresos-list/caja-egresos-list.component';
import { CajaEgresosFormComponent } from './components/caja_egresos/caja-egresos-form/caja-egresos-form.component';
import { SolicitudCajaEgresoListComponent } from './components/solicitud_caja_egreso/solicitud-caja-egreso-list/solicitud-caja-egreso-list.component';
import { SolicitudCajaEgresoFormComponent } from './components/solicitud_caja_egreso/solicitud-caja-egreso-form/solicitud-caja-egreso-form.component';
import { ProgramacionCajaEgresoFormComponent } from './components/programacion_caja_egreso/programacion-caja-egreso-form/programacion-caja-egreso-form.component';
import { ProgramacionCajaEgresoListComponent } from './components/programacion_caja_egreso/programacion-caja-egreso-list/programacion-caja-egreso-list.component';
import { LiquidacionesListComponent } from './components/liquidaciones/liquidaciones-list/liquidaciones-list.component';
import { PlanillaMovilidadListComponent } from './components/planilla_movilidad/planilla-movilidad-list/planilla-movilidad-list.component';
import { PlanillaMovilidadFormComponent } from './components/planilla_movilidad/planilla-movilidad-form/planilla-movilidad-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'liquidaciones_list',
    component: LiquidacionesListComponent,
    canActivate: [authGuard],
  },

  {
    path: 'planilla_movilidad_list',
    component: PlanillaMovilidadListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'planilla_movilidad_form',
    component: PlanillaMovilidadFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'planilla_movilidad_form/:id',
    component: PlanillaMovilidadFormComponent,
    canActivate: [authGuard],
  },

  {
    path: 'solicitud_caja_chica_list',
    component: SolicitudCajaChicaListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'solicitud_caja_chica_form',
    component: SolicitudCajaChicaFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'solicitud_caja_chica_form/:id',
    component: SolicitudCajaChicaFormComponent,
    canActivate: [authGuard],
  },

  {
    path: 'solicitud_caja_egresos_list',
    component: ProgramacionCajaEgresoListComponent,
    data: { esSolicitud: true, esProgramacion: false },
    canActivate: [authGuard],
  },
  // {
  //   path: 'solicitud_caja_egresos_form',
  //   component: SolicitudCajaEgresoFormComponent,
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'solicitud_caja_egresos_form/:id',
  //   component: SolicitudCajaEgresoFormComponent,
  //   canActivate: [authGuard],
  // },

  {
    path: 'programacion_caja_egresos_list',
    component: ProgramacionCajaEgresoListComponent,
    data: { esSolicitud: false, esProgramacion: true },
    canActivate: [authGuard],
  },
  {
    path: 'programacion_caja_egresos_form',
    component: ProgramacionCajaEgresoFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'programacion_caja_egresos_form/:id',
    component: ProgramacionCajaEgresoFormComponent,
    canActivate: [authGuard],
  },

  {
    path: 'caja_egresos_list',
    component: CajaEgresosListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'caja_egresos_form',
    component: CajaEgresosFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'caja_egresos_form/:id',
    component: CajaEgresosFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'caja_chica_list',
    component: CajaChicaListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'caja_chica_form',
    component: CajaChicaFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'caja_chica_form/:id',
    component: CajaChicaFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'requerimiento_viaticos_list',
    component: RequerimientoViaticosListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'requerimiento_viaticos_form',
    component: RequerimientoViaticosFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'requerimiento_viaticos_form/:id',
    component: RequerimientoViaticosFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'guardarusuario',
    component: GuardarusuarioComponent,
    canActivate: [authGuard],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
