import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-product-cart',
      standalone: true, 
  imports: [CommonModule,MatIconModule],
  templateUrl: './product-cart.component.html'
})
export class ProductCartComponent {

  @Input() id!: string;
  @Input() slug!: string;
  @Input() OPrice?: number;
  @Input() NPrice!: number;
  @Input() imgUrl!: string;
  @Input() discountPercent?: number;
  @Input() productName!: string;
  @Input() productDesc!: string;
  @Input() rating: number = 0;
  @Input() reviewCount: number = 0;

  liked = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

handleCart(event?: Event) {
  if (event) event.stopPropagation();

  const token = localStorage.getItem("token");
  if (!token) {
    this.router.navigate(['/login']);
    return;
  }

  this.cartService.addToCartLocal({
    _id: this.id,
    slug: this.slug,
    name: this.productName,
    price: this.NPrice,
    imageUrl: this.imgUrl,
    qty: 1
  });
}

  starsArray(): number[] {
    // Returns array of 5, 1 = filled star, 0 = empty star
    const filled = Math.round(this.rating);
    return Array.from({ length: 5 }, (_, i) => i < filled ? 1 : 0);
  }
    toggleLike(event: Event) {
    event.stopPropagation();
    this.liked = !this.liked;
  }
  navigate() {
    this.router.navigate(['/product/slug', this.slug]);
  }
}
