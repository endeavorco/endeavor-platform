import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SubscribeBusService } from 'src/app/state.management/subscribeBus';
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isSticky: boolean = false;
  isSignupOpen: boolean = false;
  topPosition: number;
  currentRoute: string = '';

  @Input() menuLinks: any[];

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= this.topPosition - 35;
  }

  corporateLinks: any[];

  constructor(
    private cacheService: CacheService,
    private route: ActivatedRoute,
    private subscribeBusService: SubscribeBusService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private helper: HelperService,
  ) {
    this.cacheService.getCollection(environment.configCollectionUrl).then(collection => {
      this.corporateLinks = collection.corporateLinks;
    });
  }

  ngOnInit() {
    let el = document.querySelector('.menu');
    let rect = el.getBoundingClientRect();
    this.topPosition = rect.top;

    this.currentRoute = this.route.snapshot.params.collectionUrl;
  }

  scrollToAnchor(target) {
    if (document.getElementById(target) != null)
      target === 'collection-page' || target === 'experience' || target === 'gallery' ? 
        this.helper.scrollTo(target, 500, 'linear', 0, 0) : 
        this.helper.scrollTo(target, 500, 'linear', 119, 0);

      // document.getElementById(target).scrollIntoView({ 
      //   behavior: "smooth", 
      //   block: "start"
      // });
    
    // Track menu click event & send to GA
    this.googleAnalyticsService.sendHeroMenuEvent(target);
  }

  toggleSignUp(val) {
    this.isSignupOpen = val;
    this.subscribeBusService.openSignUpPopup.next({ isSignupOpen: this.isSignupOpen, isBottomReached: false });

    this.googleAnalyticsService.sendContactEvent('Email');
  }
}
