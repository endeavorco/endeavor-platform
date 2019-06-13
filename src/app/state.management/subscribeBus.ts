import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscribeBusService {
  showSpinner: Subject<boolean> = new Subject<boolean>();
  openSignUpPopup: Subject<any> = new Subject<any>();

  constructor() {}


}