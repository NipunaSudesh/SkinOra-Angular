// src/app/pages/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../component/theme/header.component';
import { ProductCartComponent } from '../../../component/cart/product-cart/product-cart.component';
import { environment } from '../../../../environments/environment';

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  slug: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  longDescription?: {
    overview: string;
    keyUses?: string[];
    keyIngredients?: string[];
    howToUse: string;
  };
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  wishlist: boolean;
  country: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProductCartComponent
  ],
  templateUrl: './products.html',
})
export class Products implements OnInit {  
  products: Product[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private readonly API_URL = environment.SKINORA_API_URL;

  constructor(private router: Router) {}

ngOnInit(): void {
    setTimeout(() => {
      this.fetchProducts();
    }, 0);
  }

  async fetchProducts(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const res = await fetch(`${this.API_URL}/api/products`);
      // const res = await fetch(`${this.API_URL}/api/catalogs`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      this.products = Array.isArray(data) ? data : [];
      console.log("fatch products", data)
    } catch (error) {
      console.error("Error fetching products:", error);
      this.errorMessage = 'Failed to load products. Please try again later.';
      this.products = [];
    } finally {
      this.isLoading = false;
    }
  }

  handleAllProductsClick(): void {
    this.router.navigate(['/all-products']);
  }
    trackById(index: number, item: Product): string {
    return item._id;
  }
}