import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  err = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/dashboard/home']);
    } catch (err: any) {
      this.err = err.error.message || 'Login failed';
    }
  }
}
