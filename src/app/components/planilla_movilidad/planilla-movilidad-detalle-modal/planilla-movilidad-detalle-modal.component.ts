import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Proveedor } from '../../../interfaces/proveedor';
import { PlanillaMovilidadDetalle } from '../../../interfaces/planilla-movilidad';

import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';

@Component({
  selector: 'app-planilla-movilidad-detalle-modal',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, provideNativeDateAdapter()],
  templateUrl: './planilla-movilidad-detalle-modal.component.html',
  styleUrl: './planilla-movilidad-detalle-modal.component.css',
})
export class PlanillaMovilidadDetalleModalComponent {
  form: FormGroup;
  isEditMode: boolean;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlanillaMovilidadDetalleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlanillaMovilidadDetalle
  ) {
    this.isEditMode = !!data.fecha_gasto;
    this.form = this.fb.group({
      fecha_gasto: [data.fecha_gasto || '', Validators.required],
      lugar_origen: [data.lugar_origen || '', Validators.required],
      lugar_destino: [data.lugar_destino || '', Validators.required],
      motivo: [data.motivo || '', Validators.required],
      monto: [data.monto || 0, [Validators.required, Validators.min(0)]],
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteItem(): void {
    this.dialogRef.close('delete');
  }
  formatearFecha(date: Date) {
    return moment(date).format('DD/MM/YYYY');
  }
  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
