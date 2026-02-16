import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: any;
  showEdit: boolean = false;
  message: string = '';

  constructor(private router: Router, private zone: NgZone) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      // Redirect if no user
      this.router.navigate(['/login']);
    }
  }

  get avatarUrl(): string {
    return this.user?.image
      ? this.user.image
      : `https://api.dicebear.com/7.x/initials/svg?seed=${this.user?.name}`;
  }

  handleLogout() {
    this.message = 'Logged out successfully ✅';
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.zone.run(() => this.router.navigate(['/']));
    }, 1200);
  }

  handleSave() {
    localStorage.setItem('user', JSON.stringify(this.user));
    this.showEdit = false;
    this.message = 'Profile updated successfully 🎉';
    setTimeout(() => (this.message = ''), 3000);
  }
}
