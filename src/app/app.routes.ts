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
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'all-categories', component: AllCategoriesComponent }

    ],
  },
   { path: '**', component: ErrorComponent }
];
