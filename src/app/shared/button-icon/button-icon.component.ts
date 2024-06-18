import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-icon',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.css',
})
export class ButtonIconComponent {
  @Input() color: string = 'primary';
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
}
