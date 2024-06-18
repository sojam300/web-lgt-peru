import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  myDropdownCajaEgresos!: bootstrap.Dropdown;
  myDropdownCajaChica!: bootstrap.Dropdown;
  myDropdownViaticos!: bootstrap.Dropdown;
  constructor(private _userService: UserService, private elementRef: ElementRef) {}

  logOut() {
    this._userService.logOut();
  }
  ngOnInit(): void {
    this.myDropdownCajaEgresos = new bootstrap.Dropdown(
      this.elementRef.nativeElement.querySelector('#dropCajaEgresos')
    );
    this.myDropdownCajaChica = new bootstrap.Dropdown(this.elementRef.nativeElement.querySelector('#dropCajaChica'));
    this.myDropdownViaticos = new bootstrap.Dropdown(this.elementRef.nativeElement.querySelector('#DropViaticos'));
  }

  toggleDropDownCajaEgresos() {
    this.myDropdownCajaEgresos.toggle();
    // this.myDropdownCajaChica.hide();
  }

  toggleDropDownCajaChica() {
    this.myDropdownCajaChica.toggle();
    // this.myDropdownCajaEgresos.hide();
  }

  toggleDropDownViaticos() {
    this.myDropdownViaticos.toggle();
    // this.myDropdownCajaEgresos.hide();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#titleDropCajaEgresos')) {
      this.myDropdownCajaEgresos.hide();
    }
    if (!targetElement.closest('#titleDropCajaChica')) {
      this.myDropdownCajaChica.hide();
    }
    if (!targetElement.closest('#titleDropViaticos')) {
      this.myDropdownViaticos.hide();
    }
  }
}
