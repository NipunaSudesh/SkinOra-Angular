import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import axios from 'axios';

import { HeaderComponent } from '../../component/theme/header.component';
import { ProductCartComponent } from '../../component/cart/product-cart/product-cart.component';
import { ProductFilterComponent } from '../singleCategory/product-filter/product-filter.component';
import { MobileFilterDrawerComponent } from '../singleCategory/mobile-filter-drawer/mobile-filter-drawer.component';
import { Features } from '../../pages/home/features/features'; 
import { environment } from '../../../environments/environment';
import { IMAGES } from '../../../../public/images';

export interface ProductFilters {
  category: string;
  country: string;
  brands: string[];
  inStock: boolean;
  minPrice?: string;
  maxPrice?: string;
}

interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
  rating: number;
  oldPrice?: number;
  price: number;
  reviewCount: number;
  categorySlug: string;
  brand: string;
  country: string;
  stockStatus: string;
}

const PRODUCTS_PER_PAGE = 8;

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    ProductCartComponent,
    ProductFilterComponent,
    MobileFilterDrawerComponent,
    Features,
  ],
  templateUrl: './all-products.component.html',
})
export class AllProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage = 1;
  showMobileFilter = false;
  isLoading = false;
bannerImage = IMAGES.banner;
  filters: ProductFilters = {
    category: '',
    country: '',
    brands: [],
    inStock: false,
    minPrice: '',
    maxPrice: ''
  };

  ngOnInit() {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.isLoading = true;

    try {
      const res = await axios.get<Product[]>(`${environment.SKINORA_API_URL}/api/products`);
      this.products = Array.isArray(res.data) ? res.data : [];
      this.applyFilters();
      this.currentPage = 1;
    } catch (err) {
      console.error('Error fetching products:', err);
      this.products = [];
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      if (this.filters.category && p.categorySlug !== this.filters.category) return false;
      if (this.filters.country && p.country !== this.filters.country) return false;
      if (this.filters.brands.length && !this.filters.brands.includes(p.brand)) return false;
      if (this.filters.inStock && p.stockStatus !== 'IN_STOCK') return false;
      if (this.filters.minPrice && p.price < Number(this.filters.minPrice)) return false;
      if (this.filters.maxPrice && p.price > Number(this.filters.maxPrice)) return false;
      return true;
    });

    this.currentPage = 1;
  }

  get currentProducts(): Product[] {
    const start = (this.currentPage - 1) * PRODUCTS_PER_PAGE;
    return this.filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / PRODUCTS_PER_PAGE);
  }

  get showingRange(): string {
    const start = (this.currentPage - 1) * PRODUCTS_PER_PAGE + 1;
    const end = Math.min(start + PRODUCTS_PER_PAGE - 1, this.filteredProducts.length);
    return `${start}–${end}`;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
    closeMobileFilter() {
    this.showMobileFilter = false;
  }
}