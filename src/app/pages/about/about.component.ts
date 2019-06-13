import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent{
  environment = environment;
  constructor(
    private router: Router
  ) {}

  gotoPage(page) {
    this.router.navigate([page]);
  }
}
