import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-cart',
      standalone: true, 
  imports: [CommonModule],
  templateUrl: './product-cart.component.html'
})
export class ProductCartComponent {

  @Input() id!: string;
  @Input() slug!: string;
  @Input() OPrice?: number;
  @Input() NPrice!: number;
  @Input() imgUrl!: string;
  @Input() productName!: string;
  @Input() productDesc!: string;
  @Input() rating: number = 0;
  @Input() reviewCount: number = 0;

  liked = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  handleCart() {
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

  navigate() {
    this.router.navigate(['/product/slug', this.slug]);
  }
}
