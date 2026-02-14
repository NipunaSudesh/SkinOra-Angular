import { Component, OnInit, ChangeDetectorRef } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';
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
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private readonly API_URL = environment.SKINORA_API_URL;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef   
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  private async fetchProducts() {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();  

    try {
      const url = `${this.API_URL}/api/products`;
      console.log('Fetching products from:', url);

      const response = await axios.get(url);

      console.log('Response status:', response.status);
      console.log('Response data type:', Array.isArray(response.data) ? 'array' : typeof response.data);

      this.products = Array.isArray(response.data) ? response.data : [];
      this.isLoading = false;

      console.log("product data :", this.products);

      this.cdr.detectChanges();  // ← force template to re-render with new data
    } catch (err: any) {
      console.error('Error fetching products:', err.message || err);
      this.errorMessage = 'Failed to load products. Please try again later.';
      this.isLoading = false;
      this.products = [];
      this.cdr.detectChanges();
    }
  }

  handleAllProductsClick(): void {
    this.router.navigate(['/all-products']);
  }

  trackById(index: number, item: Product): string {
    return item._id;
  }
}