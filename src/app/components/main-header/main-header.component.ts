import { Component, OnInit, Input } from '@angular/core';
import { Router, Event } from '@angular/router';
import { SubscribeBusService } from 'src/app/state.management/subscribeBus';
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() heading: string;
  isMainPage: boolean = false;
  isMobNavOpen: boolean = false;
  isSignupOpen: boolean = false;
  event;

  constructor(
    private router: Router,
    private subscribeBusService: SubscribeBusService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private helper: HelperService
  ) { }

  ngOnInit() {
    if (this.router.url == '/') {
      this.isMainPage = true;
    }
    this.router.events.subscribe((event: Event) => {
      this.isMobNavOpen = false;
    });

    this.subscribeBusService.openSignUpPopup.subscribe((item) => this.isSignupOpen = item.isSignupOpen);
  }

  toggleNav() {
    this.isMobNavOpen = !this.isMobNavOpen;
  }

  toggleSignUp(val) {
    this.isSignupOpen = val;
    this.subscribeBusService.openSignUpPopup.next({ isSignupOpen: this.isSignupOpen, isBottomReached: false });

    this.googleAnalyticsService.sendContactEvent('Email');
  }

  scrollToAnchor(target) {
    if (document.getElementById(target) != null) {
      target === 'collection-page' ?
        this.helper.scrollTo(target, 200, 'linear', 0, 0) :
        this.helper.scrollTo(target, 500, 'linear', 119, 0);
    }
  }

}
