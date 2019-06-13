import { Injectable } from "@angular/core";
import { Gtag } from 'angular-gtag';
import { Router, Event } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class GoogleAnalyticsService {
  gtag: any;

  constructor(
    gtag: Gtag,
    private router: Router
  ) {
    this.gtag = gtag;
  }

  addToCart(product, quantity) {
    this.gtag.event('addToCart', {
      ecommerce: {
        currencyCode: 'USD',
        add: {
          products: [this.toGtagProduct(product, quantity)]
        }
      }
    });
  }

  removeFromCart(product, quantity) {
    this.gtag.event('removeFromCart', {
      ecommerce: {
        currencyCode: 'USD',
        remove: {
          products: [this.toGtagProduct(product, quantity)]
        }
      }
    });
  }

  getPageName(){
    return this.router.url === '/' ? 'Home page' : `Page ${this.router.url}`;
  }
  
  sendEvent(name, data) {
    this.gtag.event(name, data);
  }

  sendOptimizeEvent(name) {
    this.gtag.event('optimize.' + name);
  }

  sendContactEvent(label) {
    this.gtag.event('Contact concierge', {
      event_category: `${this.getPageName()} click`,
      event_label: label
    });
  }

  // Track the label of the hero ad that was clicked
  sendHeroBannerEvent(label) {
    this.gtag.event('Hero Module click', {
      event_category: `${this.getPageName()} click`,
      event_label: label
    });
  }

  // Track the label of the hero menu that was clicked
  sendHeroMenuEvent(label) {
    this.gtag.event('Hero Menu click', {
      event_category: `${this.getPageName()} click`,
      event_label: label
    });
  }

  // Track video play event - label is screen size
  sendHeroVideoEvent(label) {
    this.gtag.event('Hero Video Play', {
      event_category: `${this.getPageName()} click`,
      event_label: `Screen width ${label}`
    });
  }

  // Track click events on the product and it's associated section
  sendSectionEvent(section_name, label){
    this.gtag.event(`${section_name} click`, {
      event_category: `${this.getPageName()} click`,
      event_label: label
    });
  }

  private toGtagProduct(product, quantity) {
    return {
      id: product.id,
      name: product.title,
      category: '',
      brand: environment.brand,
      variant: product.activeOption.productFirstOption + ' ' + product.activeOption.productSecondOption,
      quantity: quantity,
      price: product.activeOption.price
    };
  }
}
