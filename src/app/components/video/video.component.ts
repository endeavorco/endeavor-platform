import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() videoUrl: any;
  @Input() videoId: any;

  @ViewChild('videoNode', null) videoNode: ElementRef;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.loadVideo(this.videoId);
    this.playVideo();
  }

  loadVideo(type) {
    if (type == 'experienceVideoDesktop')
      this.videoNode.nativeElement.src = this.videoUrl;
    this.videoNode.nativeElement.load();
  }

  playVideo() {
    this.videoNode.nativeElement.play();
  }

  openVideo() {
    this.loadVideo(this.videoId);
    let browsersArray = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
    browsersArray.forEach((browser) => {
      if (this.videoNode.nativeElement[browser])
        this.videoNode.nativeElement[browser]();
    })
    this.playVideo();

    // Track video plays & send event to GA
    this.googleAnalyticsService.sendHeroVideoEvent(window.innerWidth);
  }
}
