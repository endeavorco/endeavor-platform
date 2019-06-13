import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-transparent',
  templateUrl: './loader-transparent.component.html',
  styleUrls: ['./loader-transparent.component.scss']
})
export class LoaderTransparentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('noscroll');
  }
  
  ngAfterViewInit(): void {
    document.querySelector('body').classList.add('noscroll');
  }

}
