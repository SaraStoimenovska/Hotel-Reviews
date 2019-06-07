import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  credentials: User = {
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  register() {
    if (
      this.credentials.username === '' ||
      this.credentials.password === '' ||
      this.credentials.email === '' ||
      this.credentials.first_name === '' ||
      this.credentials.last_name === ''
    ) {
      this.notifierService.notify('error', 'All fields required');
      return;
    } else {
      this.auth.register(this.credentials).subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        err => {
          this.notifierService.notify('error', err.error.username);
        }
      );
    }
  }
}
