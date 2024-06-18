import {
  Component,
  ViewChild,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MaterialModule } from '../../modules/material/material.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';

import { filter } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MaterialModule, RouterModule, CommonModule, MatExpansionModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit {
  currentTheme: string = 'theme-azure';
  @ViewChild(MatSidenav) drawer!: MatSidenav;
  mode: 'over' | 'side' = 'side';
  opened = true;
  readonly panelOpenState = signal(false);
  solicitudes: any[] = [];
  currRoute = '';
  expanded = false;
  expandedCajaChica = false;
  constructor(
    private observer: BreakpointObserver,

    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkIfExpanded();
        // this.activeRoute = event.urlAfterRedirects || event.url;
      }
    });
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   this.activeRoute = event.urlAfterRedirects || event.url;
    // });
  }
  ngOnInit(): void {}

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
  toggleExpandedCajaChica() {
    this.expandedCajaChica = !this.expandedCajaChica;
  }
  ngAfterViewInit() {
    this.observer.observe([Breakpoints.Handset]).subscribe((result) => {
      this.mode = result.matches ? 'over' : 'side';
      this.opened = !result.matches;
    });
  }
  // checkIfExpanded() {
  //   const url = this.router.url;
  //   if (
  //     url.includes('/solicitud_caja_egresos_list') ||
  //     url.includes('/programacion_caja_egresos_list')
  //   ) {
  //     this.expanded = true;
  //   } else {
  //     this.expanded = false;
  //   }
  // }
  checkIfExpanded() {
    const url = this.router.url;
    console.log(url, 'MI RUTA PINTADA');
    this.currRoute = url;
    if (
      url.includes('/solicitud_caja_egresos_list') ||
      url.includes('/programacion_caja_egresos_list')
    ) {
      this.expanded = true;
    } else {
      this.expanded = false;
    }

    if (
      url.includes('/caja_chica_list') ||
      url.includes('/solicitud_caja_chica_list')
    ) {
      this.expandedCajaChica = true;
    } else {
      this.expandedCajaChica = false;
    }

    this.cdr.detectChanges(); // Forzar la detección de cambios
  }
  checkActiveRute(ruta: string) {
    const url = this.router.url;
    if (url.includes(ruta)) {
      return true;
    } else {
      return false;
    }
  }
}
