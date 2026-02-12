import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../component/theme/button.component';
import { HeaderComponent } from '../../component/theme/header.component';
import { TextInputComponent } from '../../component/theme/textinput.component';
import { TextareaComponent } from '../../component/theme/textarea.component';
import { TypographyComponent } from '../../component/theme/typography.component';
import { ProductCartComponent } from '../../component/cart/product-cart/product-cart.component';
import { CategoryCartComponent } from '../../component/cart/category-cart/category-cart.component';
import { AddCartComponent } from '../../component/cart/add-cart/add-cart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    HeaderComponent,
    TextInputComponent,
    TextareaComponent,
    TypographyComponent,
    ProductCartComponent,
    CategoryCartComponent,
    AddCartComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
   product = {
    id: '1',
    slug: 'vitamin-c-serum',
    OPrice: 4500,
    NPrice: 3500,
    imgUrl: 'https://via.placeholder.com/300',
    productName: 'Vitamin C Brightening Serum',
    productDesc: 'Best serum for glowing skin',
    rating: 4,
    reviewCount: 120
  };

  // Static Category
  category = {
    img: 'https://via.placeholder.com/300',
    category: 'Skincare',
    description: 'Premium skincare products',
    slug: 'skincare'
  };

  // Static Cart Item
  cartItem = {
    id: '1',
    slug: 'vitamin-c-serum',
    imageUrl: 'https://via.placeholder.com/150',
    name: 'Vitamin C Brightening Serum',
    price: 3500,
    oldPrice: 4500,
    discountPercent: 20,
    stockStatus: 'IN_STOCK',
    category: 'Skincare',
    brand: 'SkinOra',
    qty: 1
  };
}
