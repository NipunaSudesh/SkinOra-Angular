import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // ← add NgForm if you want form ref
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← this is the key addition
  ) {}

  handleSubmit(form?: NgForm) {  // optional: pass form if you want extra validation
    this.message = '';
    this.messageType = '';
    this.cdr.detectChanges();   // clear UI immediately

    // Optional: client-side check (already have password match, but good practice)
    if (form && form.invalid) {
      this.message = 'Please fill all required fields correctly';
      this.messageType = 'error';
      this.cdr.detectChanges();
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      this.messageType = 'error';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.message = '';
        this.messageType = '';
        this.cdr.detectChanges();
      }, 3000);
      return;
    }

    const payload = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
    };

    this.http
      .post<any>(`${environment.SKINORA_API_URL}/api/auth/register`, payload)
      .subscribe({
        next: (res) => {
          this.message = 'Registration successful! Redirecting to login...';
          this.messageType = 'success';
          this.cdr.detectChanges();   // ← force update

          // Optional: store token/user if backend returns it immediately
          // localStorage.setItem('token', res.token); etc.

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1800);

          setTimeout(() => {
            this.message = '';
            this.messageType = '';
            this.cdr.detectChanges();
          }, 4000);
        },

        error: (err: HttpErrorResponse) => {
          let errorMsg = 'Something went wrong. Please try again.';

          if (err.status === 400 || err.status === 409) {
            // Common for register: email taken, weak password, etc.
            errorMsg =
              err.error?.message ||
              err.error?.error ||
              err.error?.msg ||
              (typeof err.error === 'string' ? err.error : errorMsg);
          } else if (err.status === 0) {
            errorMsg = 'Cannot reach the server. Check your connection.';
          }

          // Normalize common backend messages
          if (errorMsg.toLowerCase().includes('email already') || errorMsg.includes('exists')) {
            errorMsg = 'This email is already registered.';
          } else if (errorMsg.toLowerCase().includes('password')) {
            errorMsg = 'Password requirements not met.';
          }

          this.message = errorMsg;
          this.messageType = 'error';
          this.cdr.detectChanges();   // ← critical: force UI to show error

          setTimeout(() => {
            this.message = '';
            this.messageType = '';
            this.cdr.detectChanges();
          }, 5000);
        },
      });
  }
}