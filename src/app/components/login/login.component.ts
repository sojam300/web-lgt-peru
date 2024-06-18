import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginResponse, LoginUser } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/error.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { MaterialModule } from '../../modules/material/material.module';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SpinnerComponent,
    NavbarComponent,
    // MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginUser: LoginUser = {
    correo: '',
    password: '',
  };
  loading: boolean = false;
  hide = true;
  constructor(
    private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _toastService: ToastService
  ) {}
  ngOnInit(): void {
    console.log(this.hide);
  }

  clickEvent(event: MouseEvent) {
    console.log(this.hide, 'CURR HIDE');
    this.hide = !this.hide;
    event.stopPropagation();
  }
  loggin() {
    if (!this.loginUser.correo || !this.loginUser.password) {
      this.toastr.error('Todos los campos son obligatorios!', 'Error!');
      return;
    }

    this.loading = true;
    this._userService.login(this.loginUser).subscribe({
      next: (response: LoginResponse) => {
        console.log(response, 'RESPONSE LOGIN');
        localStorage.setItem('token', response.token);
        localStorage.setItem('idusuario', response.idusuario);
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        // console.log(error, 'erorr en http REPSONSE');
        this._toastService.msgError(error);
      },
    });
  }
}
