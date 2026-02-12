import { Component, Input } from '@angular/core';
import { CartService } from '../../../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-cart',
    standalone: true, 
  imports: [CommonModule],
  templateUrl: './add-cart.component.html'
})
export class AddCartComponent {

  @Input() id!: string;
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() price!: number;
  @Input() slug!: string;
  @Input() oldPrice?: number;
  @Input() discountPercent?: number;
  @Input() stockStatus?: string;
  @Input() category?: string;
  @Input() brand?: string;
  @Input() qty!: number;
  @Input() mode: string = 'cart';

  constructor(private cartService: CartService) {}

  handleQtyChange(newQty: number) {
    if (newQty < 1) return;
    this.cartService.updateQtyLocal(this.slug, newQty);
  }

  handleRemove() {
    this.cartService.removeItemLocal(this.slug);
  }
}
