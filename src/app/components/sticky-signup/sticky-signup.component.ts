import { Component, OnInit, HostListener } from '@angular/core';
import { SubscribeBusService } from '../../state.management/subscribeBus';

@Component({
  selector: 'app-sticky-signup',
  templateUrl: './sticky-signup.component.html',
  styleUrls: ['./sticky-signup.component.scss']
})
export class StickySignupComponent implements OnInit {

  isSignupOpen: boolean = false;
  isBottomReached: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 250)){
      this.toggleSignUp(true, true);
      this.isBottomReached = true;
    } else {
      this.toggleSignUp(this.isSignupOpen, false);
      this.isBottomReached = false;
    }
  }

  constructor(
    private subscribeBusService: SubscribeBusService
  ) { }

  ngOnInit() {
    this.subscribeBusService.openSignUpPopup.subscribe((item) => {
      this.isSignupOpen = item.isSignupOpen;
      this.isBottomReached = item.isBottomReached;
    });
  }

  toggleSignUp(val, isBottomReached) {
    this.isSignupOpen = val;
    this.subscribeBusService.openSignUpPopup.next({ isSignupOpen: this.isSignupOpen, isBottomReached: isBottomReached });
  }
}
