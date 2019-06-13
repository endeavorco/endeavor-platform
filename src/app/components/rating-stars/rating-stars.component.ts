import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent{

  @Input() rating: number;

  stars = [1, 2, 3, 4, 5];

  constructor() {}

  getFillPercent(star, rating){
    return star <= rating ? '100%' : ((rating - star + 1) * 100) + '%';
  }
}
