
import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner';
import { Features  } from '../features/features';
import { Categorys   } from '../categorys/categorys';
import { CustomerTestimonials   } from '../customer-testimonials/customer-testimonials';
import { AboutSkinOra   } from '../about-skin-ora/about-skin-ora';
import { Products   } from '../products/products';

@Component({
  selector: 'app-index',
  imports: [BannerComponent, Features, Categorys,AboutSkinOra,CustomerTestimonials,Products],
  templateUrl: './index.html',
})
export class Index {

}
