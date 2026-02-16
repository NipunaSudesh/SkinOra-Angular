import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import axios from 'axios';
import { HeaderComponent } from '../../component/theme/header.component';
import { ProductCartComponent } from '../../component/cart/product-cart/product-cart.component';
import { ButtonComponent } from '../../component/theme/button.component';
import { environment } from '../../../environments/environment';

interface LongDescription {
  overview?: string;
  keyUses?: string[];
  keyIngredients?: string[];
  howToUse?: string;
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  stockStatus: string;
  categorySlug: string;
  shortDescription: string;
  longDescription?: LongDescription;
}

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    ProductCartComponent,
    ButtonComponent
  ],
  templateUrl: './single-product.component.html',
})
export class SingleProductComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  qty = signal(1);
  isLoading = signal(true);
  hasError = signal(false);

  stars = computed(() => {
    const rating = this.product()?.rating || 0;
    return Array(5).fill(0).map((_, i) => (i < Math.round(rating) ? 1 : 0));
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    } else {
      this.hasError.set(true);
      this.isLoading.set(false);
    }
  }

  async loadProduct(slug: string): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      // Fetch single product
      const productRes = await axios.get<Product>(
        `${environment.SKINORA_API_URL}/api/products/slug/${slug}`
      );
      this.product.set(productRes.data);
      console.log("single product is:", this.product());

      // Fetch related products
      if (this.product()?.categorySlug) {
        const categoryRes = await axios.get<Product[]>(
          `${environment.SKINORA_API_URL}/api/categories/${this.product()!.categorySlug}`
        );

        this.relatedProducts.set(
          categoryRes.data
            .filter(p => p.slug !== slug)
            .slice(0, 10)
        );
      }
    } catch (error) {
      console.error('Error loading product:', error);
      this.hasError.set(true);
      this.product.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  increaseQty(): void {
    this.qty.update(q => q + 1);
  }

  decreaseQty(): void {
    this.qty.update(q => Math.max(1, q - 1));
  }

  async addToCart(): Promise<void> {
    const product = this.product();
    if (!product) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      await axios.post(
        `${environment.SKINORA_API_URL}/api/cart/add`,
        { productId: product._id, qty: this.qty() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.router.navigate(['/cart']);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add to cart. Please try again.');
    }
  }

  // buyNow(): void {
  //   const product = this.product();
  //   if (!product) return;

  //   const checkoutItem = {
  //     _id: product._id,
  //     slug: product.slug,
  //     name: product.name,
  //     imageUrl: product.imageUrl,
  //     price: product.price,
  //     qty: this.qty()
  //   };

  //   const subtotal = product.price * this.qty();
  //   const shipping = 350;
  //   const total = subtotal + shipping;

  //   this.router.navigate(['/checkout'], {
  //     state: {
  //       items: [checkoutItem],
  //       subtotal,
  //       shipping,
  //       total
  //     }
  //   });
  // }
buyNow(): void {
  const product = this.product();
  if (!product) return;

  const checkoutItem = {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    oldPrice: product.oldPrice,
    discountPercent: product.discountPercent,
    stockStatus: product.stockStatus,
    category: product.categorySlug,
    brand: product.brand,
    qty: this.qty()
  };

  const subtotal = product.price * this.qty();
  const shipping = 350;
  const total = subtotal + shipping;

  console.log('Buy Now → sending to checkout:', { items: [checkoutItem], subtotal, total });

  this.router.navigate(['/checkout'], {
    state: {
      items: [checkoutItem],
      subtotal,
      shipping,
      total
    }
  });
}

}

// handleCheckout() {
//   if (!this.canCheckout()) {
//     alert('Please select at least one item');
//     return;
//   }

//   const checkoutData = {
//     items: this.selectedItems(),
//     subtotal: this.subtotal(),
//     shipping: this.shippingTotal(),
//     total: this.total()
//   };

//   console.log('SENDING TO CHECKOUT:', checkoutData); // ← add this log

//   this.router.navigate(['/checkout'], { state: checkoutData });
// }