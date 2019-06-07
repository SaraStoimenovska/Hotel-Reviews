import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials: User = {
    username: '',
    password: '',
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private notifierService: NotifierService
  ) {}

  login() {
    if (this.credentials.username === '' || this.credentials.password === '') {
      this.notifierService.notify('error', 'All fields required');
      return;
    } else {
      this.auth.login(this.credentials).subscribe(
        response => {
          this.router.navigate(['/dashboard']);
        },
        err => {
          this.notifierService.notify('error', err.error.non_field_errors);
        }
      );
    }
  }
}
