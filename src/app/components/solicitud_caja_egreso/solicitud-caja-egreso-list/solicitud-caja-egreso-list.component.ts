import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Observable, map, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProveedorService } from '../../../services/proveedor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProveedorSelect } from '../../../interfaces/proveedor';

import { ToastService } from '../../../services/error.service';

@Component({
  selector: 'app-solicitud-caja-egreso-list',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    CommonModule,
    FormsModule,
    SpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './solicitud-caja-egreso-list.component.html',
  styleUrl: './solicitud-caja-egreso-list.component.css',
})
export class SolicitudCajaEgresoListComponent implements OnInit {
  myControlProveedor = new FormControl('');

  options: string[] = [];
  proveedores: ProveedorSelect[] = [];
  filteredProveedores!: Observable<ProveedorSelect[]>;
  filteredOptions!: Observable<string[]>;

  constructor(
    private _proveedorService: ProveedorService,
    private _toastService: ToastService
  ) {}
  ngOnInit() {
    this.filteredOptions = this.myControlProveedor.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  buscarProveedores(event: any) {
    event.preventDefault();
    if (typeof this.myControlProveedor.value === 'string') {
      this._proveedorService
        .buscarPorRazonSocial2(this.myControlProveedor.value)
        .subscribe({
          next: (proveedores) => {
            const provs = proveedores.map((p) => p.razon_social);
            this.options = provs;
            this.myControlProveedor.setValue(this.myControlProveedor.value);
          },
          error: (error: HttpErrorResponse) => {
            this._toastService.msgError(error);
          },
        });
    }
  }
  onOptionSelected(event: any, option: string) {
    if (event.isUserInput) {
      console.log('Opción seleccionada:', option);
    }
  }
}
