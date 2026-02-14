import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../component/theme/header.component';
import { CategoryCartComponent } from '../../../component/cart/category-cart/category-cart.component';
import { MatIconModule } from '@angular/material/icon';

import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    CategoryCartComponent,
    MatIconModule
  ],
  templateUrl: './categorys.html',
})
export class Categorys implements OnInit, AfterViewInit {
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
  private swiper?: Swiper;

  categories: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchCategories();
  }

  ngAfterViewInit() {
    // Swiper will be initialized after data loads
  }
private initSwiper() {
  if (!this.swiperEl?.nativeElement) return;

  this.swiper = new Swiper(this.swiperEl.nativeElement, {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    spaceBetween: 16,                  
    slidesPerView: 'auto',              
    centeredSlides: false,
    breakpoints: {
      320: { slidesPerView: 'auto', spaceBetween: 12 },
      640: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    observer: true,
    observeParents: true,
    observeSlideChildren: true,
  });


  window.addEventListener('resize', () => {
    this.swiper?.update();
  });

  this.cdr.detectChanges();
}

  fetchCategories() {
    this.loading = true;
    this.error = null;

    const url = `${environment.SKINORA_API_URL}/api/categories`;
    console.log('Fetching categories from:', url);

    fetch(url)
      .then(res => {
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`HTTP ${res.status}: ${text}`);
          });
        }
        return res.json();
      })
      .then(data => {
        // console.log('Full response data:', data);
        this.categories = data || [];
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.initSwiper(), 100);
      })
      .catch(err => {
        console.error('Fetch failed:', err);
        this.error = `Failed to load categories: ${err.message}`;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  next() {
    this.swiper?.slideNext();
  }

  prev() {
    this.swiper?.slidePrev();
  }

  viewAllCategories() {
    this.router.navigate(['/all-categories']);
  }
}