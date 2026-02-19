import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface OrderItem {
  product?: { name: string };
  qty: number;
  price: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

interface Order {
  _id?: string; // ✅ optional to prevent crash
  placedAt: string;
  status: string;
  items: OrderItem[];
  totalAmount?: number;
  shippingInfo?: ShippingInfo;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: any;
  showEdit = false;
  message = '';
  activeTab: 'profile' | 'orders' = 'profile';

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loadingOrders = false;
  ordersError: string | null = null;

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(storedUser);
  }

  get avatarUrl(): string {
    return this.user?.image
      ? this.user.image
      : `https://api.dicebear.com/7.x/initials/svg?seed=${this.user?.name}`;
  }

  switchTab(tab: 'profile' | 'orders') {
    this.activeTab = tab;
    if (tab === 'orders') this.fetchOrders();
  }

  async fetchOrders() {
    if (this.orders.length) return; // ✅ prevent refetch

    this.loadingOrders = true;
    this.ordersError = null;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const res = await fetch(`${environment.SKINORA_API_URL}/api/auth/my-orders`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        this.message = 'Session expired. Please login again.';
        localStorage.clear();
        this.router.navigate(['/login']);
        return;
      }

      if (!res.ok) throw new Error('Failed to load orders');

      const data = await res.json();
      this.orders = data.orders || [];
      console.log('Orders loaded:', this.orders);
    } catch (err) {
      console.error(err);
      this.ordersError = 'Failed to load orders.';
    } finally {
      this.loadingOrders = false;
    }
  }

  // ✅ prevents Angular rendering errors
  trackByOrderId(index: number, order: Order) {
    return order._id || index;
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

  calculateSubtotal(order: Order) {
    return order.items.reduce((s, i) => s + i.qty * i.price, 0);
  }

  totalQty(order: Order) {
    return order.items.reduce((s, i) => s + i.qty, 0);
  }

  shipping(order: Order) {
    return this.totalQty(order) * 350;
  }

  grandTotal(order: Order) {
    return order.totalAmount ?? this.calculateSubtotal(order) + this.shipping(order);
  }

  handleLogout() {
    this.message = 'Logged out successfully ✅';
    setTimeout(() => {
      localStorage.clear();
      this.zone.run(() => this.router.navigate(['/']));
    }, 1200);
  }

  handleSave() {
    localStorage.setItem('user', JSON.stringify(this.user));
    this.showEdit = false;
    this.message = 'Profile updated successfully 🎉';
  }
}
