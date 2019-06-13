import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import {trigger,state,style,animate,transition} from '@angular/animations';

@Component({
  selector: 'hurryup-popup',
  templateUrl: './hurryup-popup.component.html',
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0, zIndex: -1}),
        animate(800 )
      ]),
      transition(':leave',
        animate(800, style({opacity: 0, zIndex: 1})))
    ]),
  ],
  styleUrls: ['./hurryup-popup.component.scss']
})
export class HurryupPopupComponent implements OnInit {
  peopleNumber: number = Math.floor(Math.random() * 19) + 1;
  show: boolean = false;
  environment = environment;
  constructor() { }

  ngOnInit() {
    let hurryUpShowed = sessionStorage.getItem('hurryUpShowed');
    if (!hurryUpShowed){
      sessionStorage.setItem('hurryUpShowed', 'true');
      this.show = true;
      setTimeout(() => this.show = false, 15000);
    }
  }

  close() {
    this.show = false;
  }

}
