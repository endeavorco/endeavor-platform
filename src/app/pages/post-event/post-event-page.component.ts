import { Component, ViewChild, Inject, Input, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
//import { SwiperDirective, SwiperConfigInterface } from "ngx-swiper-wrapper";

@Component({
  selector: 'app-post-event-page',
  templateUrl: './post-event-page.component.html',
  styleUrls: ['./article.component.scss', './post-event-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostEventComponent{

  @Input() collection: any;

  videoUrls = null;//environment.videoUrls;
  environmentData = environment;
  // config: SwiperConfigInterface = {
  //   direction: 'horizontal',
  //   slidesPerView: 1,
  //   keyboard: true,
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  //   },
  //   pagination: true,
  //   mousewheel: false,
  //   loop: true,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: true,
  //   }
  // };
  //@ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  @ViewChild('videoDesktop', null) videoDesktop: any;

  constructor(
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    private router: Router
  ) { }

  ngAfterViewInit() {
    if (this.videoUrls)
      this.playVideo('videoDesktop');
  }

  gotoPage(page) {
    this.router.navigate([page]);
  }

  playVideo(type) {
    this[type].nativeElement.src = this.videoUrls[type].url;
    this[type].nativeElement.poster = this.videoUrls[type].poster;
    this[type].nativeElement.load();
    this[type].nativeElement.play();
  }
}