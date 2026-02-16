import { Routes } from '@angular/router';
import {Index } from './pages/home/index';
import { PublicLayoutComponent } from './component/layout/public-layout/public-layout.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy.component';
import { TermsComponent } from './pages/terms.component';
import { ErrorComponent } from './pages/error.component';
import { ThankYouComponent } from './pages/thank-you.component';
import { AllCategoriesComponent } from './pages/all-categories/all-categories.component';
import { CategoryPageComponent } from './pages/singleCategory/category-page.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { AddToCartComponent } from './pages/add-to-cart/add-to-cart.component';
import { CheckoutComponent } from './pages/checkout/checkout/checkout.component';

export const routes: Routes = [
        {
    path: '',
    component: PublicLayoutComponent, 
    children: [
      { path: '', component: Index }, 
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
    { path: 'profile', component: ProfileComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'all-categories', component: AllCategoriesComponent },
  { path: 'all-products', component: AllProductsComponent },
  { path: 'cart', component:AddToCartComponent },
  { path: 'checkout', component:CheckoutComponent },
{ path: 'product-category/:categorySlug', component: CategoryPageComponent, title: 'Category – SkinOra' },
{ path: 'product/slug/:slug', component: SingleProductComponent, title: 'Product – SkinOra' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
