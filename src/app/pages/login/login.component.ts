import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IMAGES } from '../../../../public/images';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  images = IMAGES;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  handleSubmit(form: NgForm) {
    this.message = '';
    this.messageType = '';
    this.cdr.markForCheck();

    if (form.invalid) {
      this.message = 'Please fill in all required fields';
      this.messageType = 'error';
      this.cdr.markForCheck();

      setTimeout(() => {
        this.message = '';
        this.messageType = '';
        this.cdr.markForCheck();
      }, 3000);
      return;
    }

    const payload = {
      email: this.email.trim(),
      password: this.password,
    };

    this.http
      .post<any>(`${environment.SKINORA_API_URL}/api/auth/login`, payload)
      .subscribe({
        next: (res) => {
          this.message = 'Login successful! Redirecting...';
          this.messageType = 'success';
          this.cdr.markForCheck();  
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          setTimeout(() => this.router.navigate(['/']), 1500);

          setTimeout(() => {
            this.message = '';
            this.messageType = '';
            this.cdr.markForCheck();
          }, 4000);
        },

        error: (err: HttpErrorResponse) => {
          let backendMessage =
            err.error?.message ||
            err.error?.error ||
            (typeof err.error === 'string' ? err.error : null) ||
            err.message ||
            'Invalid email or password. Please try again.';

          if (backendMessage.toLowerCase().includes('invalid') || backendMessage.includes('credentials')) {
            backendMessage = 'Invalid email or password';
          }

          this.message = backendMessage;
          this.messageType = 'error';
          this.cdr.markForCheck();  

          setTimeout(() => {
            this.message = '';
            this.messageType = '';
            this.cdr.markForCheck();
          }, 4000);
        },
      });
  }
}