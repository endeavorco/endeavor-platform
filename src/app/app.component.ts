import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'app';
  isMobileMenuOpened: boolean = false;
  dataLoaded: boolean = false;
  isVipPage: boolean = false;
  isAdminPage: boolean = false;
  cartItemsLength: number = 0;
  constructor(private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isVipPage = event.url.indexOf('vip-experience') > -1;
        this.isAdminPage = event.url.indexOf('admin/') === 1;
      }
    });
  }

  ngOnInit() {
    let _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
    if (_iOSDevice) {
      document.querySelector('html').classList.add('is-ios');
    }
  }

  track(category, action, label) {
    this.googleAnalyticsService.sendEvent('event', {
      'send_to': environment.ga_identifier,
      'event_category': category,
      'event_action': action,
      'event_label': label
    });
  }

  showMenu() {
    this.isMobileMenuOpened = true;
  }

  closeMenu() {
    this.isMobileMenuOpened = false;
  }
}
