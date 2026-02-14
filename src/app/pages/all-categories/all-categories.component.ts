// src/app/pages/all-categories/all-categories.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../../component/theme/header.component';
import { CategoryCartComponent } from '../../component/cart/category-cart/category-cart.component';
import axios from 'axios';  // ← import axios

import { environment } from '../../../environments/environment';

interface Category {
  _id: string;
  categoriesName: string;
  description: string;
  imageUrl: string;
  slug: string;
}

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CategoryCartComponent
  ],
  template: `
    <div class="flex flex-col items-center justify-center gap-4 card-container px-4">
      <div>
        <app-header
          [title]="'Shop by Categories'"
          [description]="'Explore our curated selection of beauty categories tailored to your needs.'"
        ></app-header>
      </div>

      <!-- Loading -->
      @if (loading) {
        <div class="py-20 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading categories...</p>
        </div>
      }

      <!-- Error -->
      @else if (error) {
        <div class="py-20 text-center text-red-600">
          <p class="text-xl">{{ error }}</p>
          <button 
            (click)="fetchCategories()" 
            class="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition">
            Try Again
          </button>
        </div>
      }

      <!-- Categories Grid -->
      @else if (categories.length > 0) {
        <div class="flex flex-wrap justify-center items-center gap-4 w-full">
          @for (category of categories; track category._id) {
            <app-category-cart
              [category]="category.categoriesName"
              [description]="category.description"
              [img]="category.imageUrl"
              [slug]="category.slug"
            />
          }
        </div>
      }

      <!-- Empty -->
      @else {
        <p class="text-gray-500 py-20 text-center w-full text-lg">
          No categories available at the moment.
        </p>
      }
    </div>
  `
})
export class AllCategoriesComponent implements OnInit {

  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  private readonly API_URL = environment.SKINORA_API_URL;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Re-fetch every time the user navigates to this page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/all-categories')
    ).subscribe(() => {
      // console.log('Navigated to /all-categories → re-fetching categories');
      this.fetchCategories();
    });
  }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    const url = `${this.API_URL}/api/categories`;
    // console.log('Fetching categories from:', url);

    axios.get(url)
      .then(response => {
        // console.log('Response status:', response.status);
        // console.log('Response data:', response.data);

        this.categories = response.data || [];
        this.loading = false;
        this.cdr.detectChanges();
        // console.log('Categories loaded:', this.categories);
      })
      .catch(err => {
        console.error('Fetch failed:', err);
        this.error = `Failed to load categories: ${err.message || 'Unknown error'}`;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}