import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-hero-banner',
  templateUrl: './product-hero-banner.component.html',
  styleUrls: ['./product-hero-banner.component.scss']
})
export class ProductHeroBannerComponent implements OnInit {

  environment = environment;
  heading: string = 'New York Fashion Week';

  @Input() collection: any;

  constructor() { }

  ngOnInit() {
    
  }
}
