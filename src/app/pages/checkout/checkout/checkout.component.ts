import { Component, signal, computed, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddCartComponent } from '../../../component/cart/add-cart/add-cart.component';
import {  HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface CheckoutNavigationState {
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-edit-shipping-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white w-full max-w-[700px] lg:max-w-[900px] rounded-xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-medium text-gray-900">
            Edit Shipping Information
          </h2>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <div class="flex flex-col gap-6">
            <!-- First & Last Name -->
            <div class="flex flex-col md:flex-row w-full gap-4">
              <div class="flex flex-col flex-1">
                <label class="text-gray-800 mb-1.5 font-medium">First Name</label>
                <input
                  type="text"
                  placeholder="Enter Your First Name"
                  [(ngModel)]="data.firstName"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-primary transition duration-150"
                  required
                />
              </div>

              <div class="flex flex-col flex-1">
                <label class="text-gray-800 mb-1.5 font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Last Name"
                  [(ngModel)]="data.lastName"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-primary transition duration-150"
                  required
                />
              </div>
            </div>

            <!-- Phone & Email -->
            <div class="flex flex-col md:flex-row w-full gap-4">
              <div class="flex flex-col flex-1">
                <label class="text-gray-800 mb-1.5 font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter Your Phone Number"
                  [(ngModel)]="data.phone"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-primary transition duration-150"
                  required
                />
              </div>

              <div class="flex flex-col flex-1">
                <label class="text-gray-800 mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  [(ngModel)]="data.email"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-primary transition duration-150"
                  required
                />
              </div>
            </div>

            <!-- Address -->
            <div class="flex flex-col w-full">
              <label class="text-gray-800 mb-1.5 font-medium">Address</label>
              <textarea
                placeholder="Enter Your Full Address"
                [(ngModel)]="data.address"
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary 
                       focus:border-primary transition duration-150 resize-y min-h-[100px]"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex justify-end gap-4 px-6 py-5 border-t border-gray-200">
          <button
            (click)="onCancel()"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 
                   hover:bg-gray-50 font-medium transition duration-150"
          >
            Cancel
          </button>

          <button
            (click)="onSave()"
            class="px-6 py-2.5 bg-primary text-white rounded-lg 
                   hover:bg-primary/90 font-medium transition duration-150"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `,
})
export class EditShippingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditShippingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShippingInfo
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}

// ── Main Checkout Component (unchanged except imports & open method) ────────
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    AddCartComponent,
    HttpClientModule   
  ],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  items = signal<any[]>([]);
  subtotal = signal<number>(0);
  shipping = signal<number>(0);
  total = signal<number>(0);

  shippingInfo = signal<ShippingInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  itemCount = computed(() => this.items().length);
  formattedSubtotal = computed(() => this.subtotal().toFixed(2));
  formattedShipping = computed(() => this.shipping().toFixed(2));
  formattedTotal = computed(() => this.total().toFixed(2));

  fullName = computed(() => {
    const info = this.shippingInfo();
    return info.firstName && info.lastName 
      ? `${info.firstName} ${info.lastName}` 
      : 'Not provided';
  });

  ngOnInit() {
    const state = history.state as CheckoutNavigationState | undefined;

    console.log('CHECKOUT → Received navigation state via history.state:', state);

    if (!state || !state.items || state.items.length === 0) {
      console.log('No valid checkout data found – redirecting to cart');
      this.router.navigate(['/cart']);
      return;
    }

    this.items.set(state.items);
    this.subtotal.set(state.subtotal || 0);
    this.shipping.set(state.shipping || 350);
    this.total.set(state.total || (state.subtotal + state.shipping));

    console.log('Checkout page successfully loaded data:', {
      itemsCount: this.itemCount(),
      firstItemName: this.items()[0]?.name || '—',
      subtotal: this.subtotal(),
      shipping: this.shipping(),
      total: this.total()
    });
  }

  openEditShipping() {
    this.dialog.open(EditShippingDialogComponent, {
      disableClose: false,              // allow click outside to close
      hasBackdrop: true,
      backdropClass: 'bg-black/50',
      panelClass: 'custom-dialog-panel', // optional: for extra styling
      width: 'auto',
      maxWidth: '900px',
      minWidth: '320px',
      data: { ...this.shippingInfo() }
    }).afterClosed().subscribe((result: ShippingInfo | undefined) => {
      if (result) {
        this.shippingInfo.set(result);
        console.log('Shipping info updated:', result);
      }
    });
  }
async placeOrder() {
    // Client-side validation
    const info = this.shippingInfo();
    if (!info.firstName || !info.lastName || !info.phone || !info.email || !info.address) {
      this.errorMsg.set('Please fill in all shipping information.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMsg.set('Please login again.');
      setTimeout(() => this.router.navigate(['/login']), 1800);
      return;
    }

    const orderData = {
      items: this.items().map(item => ({
        product: item._id || item.id,
        qty: item.qty || 1,
        price: item.price,
      })),
      shippingInfo: { ...info },
      subtotal: this.subtotal(),
      shipping: this.shipping(),
      totalAmount: this.total()
    };

    this.loading.set(true);
    this.errorMsg.set('');

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });

      const result: any = await this.http.post(`${environment.SKINORA_API_URL}/api/auth/place-order`, orderData, { headers }).toPromise();

      // Navigate to thank-you page with order ID
      this.router.navigate(['/thank-you'], { state: { orderId: result.order?._id } });
    } catch (err: any) {
      console.error('Order placement error:', err);
      this.errorMsg.set(err?.error?.message || 'Something went wrong. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
  // placeOrder() {
  //   console.log('Placing order with:', {
  //     items: this.items(),
  //     shippingInfo: this.shippingInfo(),
  //     total: this.total()
  //   });
  //   // TODO: send to backend later
  //   this.router.navigate(['/thank-you']);
  // }

  goBackToCart() {
    this.router.navigate(['/cart']);
  }
}