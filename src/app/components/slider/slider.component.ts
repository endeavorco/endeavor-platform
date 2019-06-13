import { Component, OnInit, Input } from '@angular/core';
import { tns } from "../../../../node_modules/tiny-slider/src/tiny-slider";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() config: any;
  @Input() images: any[];

  slider: any;
  index = Math.floor(Math.random() * Math.floor(100));

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.slider = tns({
      container: '.my-slider' + this.index,
      autoWidth: this.config.autoWidth || false,
      items: this.config.items || 1,
      gutter: this.config.gutter || 0,
      nav: false,
      controls: false,
      autoplayButton: false,
      autoplayButtonOutput: false,
      speed: 1000,
      slideBy: 'page',
      autoplayHoverPause: true,
      mouseDrag: true,
      autoplay: this.config.autoplay || false
    });
  }
}
