import { Component, ViewChild, OnInit, Input, HostListener } from '@angular/core';
import { GoogleAnalyticsService } from "../../services/google-analytics.service";

@Component({
  selector: 'app-hero-video',
  templateUrl: './hero-video.component.html',
  styleUrls: ['./hero-video.component.scss']
})
export class HeroVideoComponent implements OnInit {

  isVideoPlay: boolean = true;
  isVideoOpen: boolean = false;
  state = 'hide';

  @Input() collection: any;
  @ViewChild('bgVideoDesktop', null) bgVideoDesktop: any;
  @ViewChild('mainVideoDesktop', null) mainVideoDesktop: any;
  @ViewChild('fullVideo', null) fullVideo: any;
  @ViewChild('overlay', null) overlay: any;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {

    if (window.innerWidth >= 1024) {
      const [red, green, blue, opacity] = [255, 255, 255, 0];
      const step = 1 + (window.scrollY || window.pageYOffset);
      const [r, g, b, o] = [red / step, green / step, blue / step, window.scrollY / 650];
      this.overlay.nativeElement.style.backgroundColor = `rgb(${r}, ${g}, ${b}, ${o})`;
    }

  }

  ngOnInit() {
    if (window.innerWidth < 1024) {
      this.pauseVideo('bgVideoDesktop');
    } else {
      this.loadVideo('bgVideoDesktop');
      this.playVideo('bgVideoDesktop');

      this.loadVideo('mainVideoDesktop');
      this.pauseVideo('mainVideoDesktop');
    }

  }

  loadVideo(type) {
    if (type == 'mainVideoDesktop') {
      this[type].nativeElement.src = this.collection.videoLinks.mainVideoUrl;
    } else if (type == 'bgVideoDesktop') {
      this[type].nativeElement.src = this.collection.videoLinks.bgVideoUrl;
    } else if (type == 'fullVideo') {
      this[type].nativeElement.src = this.collection.videoLinks.fullVideoUrl;
    }

    this[type].nativeElement.load();
  }

  playVideo(type) {
    this[type].nativeElement.play();
    this.isVideoPlay = true;
  }

  pauseVideo(type) {
    this.isVideoPlay = false;
    this[type].nativeElement.pause();
  }

  toggleVideo(type) {
    this.isVideoPlay ? this[type].nativeElement.pause() : this[type].nativeElement.play();
    this.isVideoPlay = !this.isVideoPlay;
  }

  openVideo() {
    if (window.innerWidth <= 1024) {
      this.loadVideo('fullVideo');
      document.getElementsByClassName('hero-video-main__fullvideo')[0].classList.add("hero-video-main__fullvideo_show");
      this.playVideo('fullVideo');
    }

    this.loadVideo('fullVideo');
    let browsersArray = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen' ];
    browsersArray.forEach((browser) => {
      if (this.fullVideo.nativeElement[browser])
        this.fullVideo.nativeElement[browser]();
    })
    this.playVideo('fullVideo');

    // Track video plays & send event to GA
    this.googleAnalyticsService.sendHeroVideoEvent(window.innerWidth);
  }

  toggleFullScreenVideo() {

    this.isVideoOpen = !this.isVideoOpen;

    if (this.isVideoOpen == false) {
      this.pauseVideo('fullVideo');
      this.fullVideo.nativeElement.classList.remove("hero-video-main__fullvideo_show");
    }
  }

}
