import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // for + / − icons
import { CartService } from '../../../services/cart';   // adjust path

@Component({
  selector: 'app-add-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,          
  ],
  templateUrl: './add-cart.component.html',

})
export class AddCartComponent {
  @Input() id!: string;
  @Input() imageUrl?: string;
  @Input() name!: string;
  @Input() selected: boolean = false;
  @Input() price!: number;
  @Input() slug!: string;
  @Input() oldPrice?: number;
  @Input() discountPercent?: number;
  @Input() stockStatus?: string;
  @Input() category?: string;
  @Input() brand?: string;
  @Input() qty!: number;
  @Input() mode: 'cart' | 'checkout' = 'cart';

  // Emit events so parent can react (and sync with backend if needed)
  @Output() qtyChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();
  @Output() toggleSelect = new EventEmitter<void>(); // if you have checkbox/select

  constructor(private cartService: CartService) {}

increaseQty() {
  this.qty += 1;                         // ✅ increase by 1
  this.qtyChange.emit(this.qty);         // notify parent
  this.cartService.updateQtyLocal(this.slug, this.qty);
}

decreaseQty() {
  if (this.qty <= 1) return;             // prevent < 1

  this.qty -= 1;                         // ✅ decrease by 1
  this.qtyChange.emit(this.qty);
  this.cartService.updateQtyLocal(this.slug, this.qty);
}


  onRemove() {
    this.remove.emit();                    // tell parent to handle remove
    this.cartService.removeItemLocal(this.slug); // optimistic
  }

  // Optional: if you want direct input field change
  onQtyInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value) && value >= 1) {
      this.qtyChange.emit(value);
      this.cartService.updateQtyLocal(this.slug, value);
    }
  }
}