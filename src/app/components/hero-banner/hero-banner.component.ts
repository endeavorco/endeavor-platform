import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ShopifyService } from "../../services/shopify.service";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";


@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss']
})
export class HeroBannerComponent implements OnInit{
  environment = environment;
  heading:string = 'New York Fashion Week';
  sliderConfig = { autoplay: true };
  
  @Input() config: any;
  @Input() autoplay: boolean = false;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit(){

  }

  sendBannerClickEvent(label){
    this.googleAnalyticsService.sendHeroBannerEvent(label);
  }

}
