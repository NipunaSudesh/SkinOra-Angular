import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-cart',
      standalone: true, 
  imports: [CommonModule],
  templateUrl: './category-cart.component.html'
})
export class CategoryCartComponent {

  @Input() img!: string;
  @Input() category!: string;
  @Input() description!: string;
  @Input() slug!: string;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate(['/product-category', this.slug]);
  }
}
