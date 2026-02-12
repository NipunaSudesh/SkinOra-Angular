import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  getCart() {
    return this.cartItems.value;
  }

  addToCartLocal(item: CartItem) {
    const current = this.getCart();
    const existing = current.find(i => i.slug === item.slug);

    if (existing) {
      existing.qty += 1;
    } else {
      current.push(item);
    }

    this.cartItems.next([...current]);
  }

  updateQtyLocal(slug: string, qty: number) {
    const updated = this.getCart().map(item =>
      item.slug === slug ? { ...item, qty } : item
    );

    this.cartItems.next(updated);
  }

  removeItemLocal(slug: string) {
    const filtered = this.getCart().filter(item => item.slug !== slug);
    this.cartItems.next(filtered);
  }
}
