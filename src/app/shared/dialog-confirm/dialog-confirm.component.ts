import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../modules/material/material.module';
@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.css',
})
export class DialogConfirmComponent {
  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
