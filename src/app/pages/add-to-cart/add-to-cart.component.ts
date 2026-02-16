import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AddCartComponent } from '../../component/cart/add-cart/add-cart.component';

// ────────────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────────────
interface Product {
  _id: string;
  slug?: string;           // made optional
  name: string;
  price: number;
  image?: string;
  oldPrice?: number;
  discountPercent?: number;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  category?: string;
  brand?: string;
}

interface CartApiItem {
  product: Product | null;   // allow null to match reality
  qty: number;
}

interface CartItem extends Product {
  _id: string;
  slug: string;              
  qty: number;
  price: number;
  imageUrl:string;
}

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, AddCartComponent],
  templateUrl: './add-to-cart.component.html',
})
export class AddToCartComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  cartItems = signal<CartItem[]>([]);
  selectedSlugs = signal<string[]>([]);

  isLoading = signal(true);
  hasError = signal(false);

  readonly SHIPPING_FEE = 350;

shippingTotal = computed(() =>
  this.selectedItems().length * this.SHIPPING_FEE
);


  selectedItems = computed(() =>
    this.cartItems().filter(item => this.selectedSlugs().includes(item.slug))
  );

  subtotal = computed(() =>
    this.selectedItems().reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  total = computed(() => this.subtotal() + this.shippingTotal());

  canCheckout = computed(() => this.selectedItems().length > 0);

  ngOnInit() {
    this.fetchCart();
  }
private fetchCart() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.isLoading.set(false);
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.get<CartApiItem[]>(`${environment.SKINORA_API_URL}/api/cart`, { headers })
    .subscribe({
      next: (data) => {
        console.log('[Cart API raw response]', data);

        const formatted = data
          .filter((item): item is CartApiItem & { product: Product } =>
            !!item && item.product !== null && item.product !== undefined
          )
          .map(item => {
            const prod = item.product; // now non-null

            const slug = prod.slug || prod._id || `missing-slug-${prod._id || 'no-id'}`;

            return {
              ...prod,
              _id: prod._id,
              slug,
              qty: item.qty ?? 1,
              price: Number(prod.price) || 0
            } as CartItem;
          });

        console.log('[Formatted cart items]', formatted);

        this.cartItems.set(formatted);
        this.selectedSlugs.set(formatted.map(i => i.slug));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
}
updateQty(slug: string, newQty: number) {
  // Update UI immediately
  this.cartItems.update(items =>
    items.map(item =>
      item.slug === slug
        ? { ...item, qty: Math.max(1, newQty) } // use newQty directly
        : item
    )
  );


    const updatedItem = this.cartItems().find(i => i.slug === slug);
    if (!updatedItem) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `${environment.SKINORA_API_URL}/api/cart/update`,
      { productId: updatedItem._id, qty: updatedItem.qty },
      { headers }
    ).subscribe({
      error: (err) => {
        console.error('Qty update failed:', err);
        this.fetchCart(); // rollback
      }
    });
  }

  removeItem(slug: string) {
    // Capture data BEFORE optimistic update
    const itemToRemove = this.cartItems().find(i => i.slug === slug);
    if (!itemToRemove) return;

    const productId = itemToRemove._id;

    // Optimistic update
    this.cartItems.update(items => items.filter(i => i.slug !== slug));
    this.selectedSlugs.update(slugs => slugs.filter(s => s !== slug));

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(
      `${environment.SKINORA_API_URL}/api/cart/remove/${productId}`,
      { headers }
    ).subscribe({
      error: (err) => {
        console.error('Remove failed:', err);
        this.fetchCart(); // rollback
      }
    });
  }

  toggleSelect(slug: string) {
    this.selectedSlugs.update(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  }

  selectAll(toggle: boolean) {
    if (toggle) {
      this.selectedSlugs.set(this.cartItems().map(i => i.slug));
    } else {
      this.selectedSlugs.set([]);
    }
  }

handleCheckout() {
  if (!this.canCheckout()) {
    alert('Please select at least one item');
    return;
  }

  const checkoutData = {
    items: this.selectedItems(),
    subtotal: this.subtotal(),
    shipping: this.shippingTotal(),
    total: this.total()
  };

  console.log('SENDING TO CHECKOUT:', checkoutData); // ← add this log

  this.router.navigate(['/checkout'], { state: checkoutData });
}
}