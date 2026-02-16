import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'; 

export interface CartItem {
  _id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    // Optional: load cart from backend on service init if token exists
  }

  getCartSnapshot(): CartItem[] {
    return this.cartItems.value;
  }

  addToCartLocal(item: CartItem): void {
    const current = [...this.getCartSnapshot()];
    const existingIndex = current.findIndex(i => i._id === item._id || i.slug === item.slug);

    if (existingIndex !== -1) {
      current[existingIndex] = {
        ...current[existingIndex],
        qty: current[existingIndex].qty + (item.qty || 1)
      };
    } else {
      current.push({ ...item, qty: item.qty || 1 });
    }

    this.cartItems.next(current);
  }

  updateQtyLocal(slug: string, qty: number): void {
    if (qty < 1) return;
    const updated = this.getCartSnapshot().map(item =>
      item.slug === slug ? { ...item, qty } : item
    );
    this.cartItems.next(updated);
  }

  removeItemLocal(slug: string): void {
    const filtered = this.getCartSnapshot().filter(item => item.slug !== slug);
    this.cartItems.next(filtered);
  }

  // ── Backend methods ───────────────────────────────────────

  addToCartBackend(productId: string, qty: number = 1): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      `${environment.SKINORA_API_URL}/api/cart/add`,
      { productId, qty },
      { headers }
    );
  }

  // Optional: load full cart from server (use in cart page ngOnInit)
  loadCartFromServer(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return new Observable(observer => observer.error('No token'));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${environment.SKINORA_API_URL}/api/cart`, { headers });
  }
}