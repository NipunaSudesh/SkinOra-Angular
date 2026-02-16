import { Routes } from '@angular/router';
import { Index } from './pages/home/index';
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
      { path: '', component: Index, title: 'SkinOra - Premium Skincare Products' },

      { path: 'about', component: AboutComponent, title: 'About Us - SkinOra' },

      { path: 'contact', component: ContactComponent, title: 'Contact Us - SkinOra' },

      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        title: 'Privacy Policy - SkinOra'
      },

      { path: 'terms', component: TermsComponent, title: 'Terms & Conditions - SkinOra' },

      { path: 'profile', component: ProfileComponent, title: 'My Profile - SkinOra' },

      { path: 'thank-you', component: ThankYouComponent, title: 'Thank You - SkinOra' },

      {
        path: 'all-categories',
        component: AllCategoriesComponent,
        title: 'All Categories - SkinOra'
      },

      {
        path: 'all-products',
        component: AllProductsComponent,
        title: 'All Products - SkinOra'
      },

      { path: 'cart', component: AddToCartComponent, title: 'Shopping Cart - SkinOra' },

      { path: 'checkout', component: CheckoutComponent, title: 'Checkout - SkinOra' },

      {
        path: 'product-category/:categorySlug',
        component: CategoryPageComponent,
        title: 'Category – SkinOra'
      },

      {
        path: 'product/slug/:slug',
        component: SingleProductComponent,
        title: 'Product – SkinOra'
      },
    ],
  },

  { path: 'login', component: LoginComponent, title: 'Login - SkinOra' },

  { path: 'register', component: RegisterComponent, title: 'Register - SkinOra' },

  // Optional: wildcard route for 404
  { path: '**', component: ErrorComponent, title: 'Page Not Found - SkinOra' },
];