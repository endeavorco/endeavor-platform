import { Component, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  sequence
} from '@angular/animations';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  animations: [
    trigger('simpleAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0, zIndex: -1 }),
        animate(300)
      ]),
      transition(':leave',
        animate(300, style({ opacity: 0, zIndex: 1 })))
    ]),
  ]
})
export class MobileMenuComponent {
  @Output() public onCloseMenu: EventEmitter<any> = new EventEmitter<any>();
  @Input() isOpen;
  // @Input() products;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.closeMenu();
  }
  
  products: any;
  routerSubs;
  
  constructor(
    private router: Router,
    private cacheService: CacheService,
  ) {
    this.routerSubs = this.router.events.pipe(
      filter((event: any) => event instanceof NavigationStart)
    ).subscribe(() => {
      this.closeMenu();
    });

    //this.cacheService.queryPromise.then(() => this.products = this.cacheService.products );
     
  }

  goToLink(product): void {
    this.router.navigate(['/event', product.id]);
    this.onCloseMenu.emit('closeMobileMenu');
  }

  goProduct(product): void {
    this.router.navigate(['/event', product.id]);
    this.onCloseMenu.emit('closeMobileMenu');
  }

  closeMenu() {
    this.onCloseMenu.emit('closeMobileMenu');
    this.routerSubs.unsubscribe();
  }

}
