import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart'; // ← adjust path if needed

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-cart.component.html',
  // styleUrls: ['./product-cart.component.scss'] // optional
})
export class ProductCartComponent {
  @Input() id!: string;
  @Input() slug!: string;
  @Input() OPrice?: number;
  @Input() NPrice!: number;
  @Input() imgUrl!: string;
  @Input() discountPercent?: number;
  @Input() productName!: string;
  @Input() productDesc?: string;
  @Input() rating: number = 0;
  @Input() reviewCount: number = 0;

  liked = false;
  isAdding = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  handleCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdding = true;

    // 1. Optimistic local update — fast UI feedback
    this.cartService.addToCartLocal({
      _id: this.id,
      slug: this.slug,
      name: this.productName,
      price: this.NPrice,
      imageUrl: this.imgUrl,
      qty: 1
    });

    // 2. Real backend call
    this.cartService.addToCartBackend(this.id, 1).subscribe({
      next: () => {
        this.isAdding = false;

        // Show beautiful success message
        this.snackBar.open(
          `${this.productName} added to cart! ✓`,
          'VIEW CART',
          {
            duration: 5000,                  // disappears after 5 seconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          }
        ).onAction().subscribe(() => {
          // When user clicks "VIEW CART"
          this.router.navigate(['/cart']);
        });
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.isAdding = false;

        this.snackBar.open(
          'Failed to add to cart. Please try again.',
          'CLOSE',
          {
            duration: 6000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  toggleLike(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.liked = !this.liked;
  }

  handleShare(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    alert('Share feature coming soon!');
  }

  navigateToProduct(): void {
    this.router.navigate(['/product/slug', this.slug]);
  }

  starsArray(): number[] {
    const filled = Math.round(this.rating);
    return Array.from({ length: 5 }, (_, i) => (i < filled ? 1 : 0));
  }

  get hasDiscount(): boolean {
    return !!this.OPrice && this.OPrice > this.NPrice;
  }

  get discountPercentage(): number | null {
    if (!this.hasDiscount) return null;
    return Math.round(((this.OPrice! - this.NPrice!) / this.OPrice!) * 100);
  }
}