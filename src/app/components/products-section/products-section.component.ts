import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { GoogleAnalyticsService } from "../../services/google-analytics.service";


@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss']
})
export class ProductsSectionComponent {

  @Input() collection: any;
  @Input() title: string;
  @Input() description: string;
  
  constructor(
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnChanges() {
    if (this.collection)
      this.collection.productList.forEach(product => product.formattedDate = this.formatDate(product.startDate, product.endDate));
  }

  formatDate(startDate, endDate){
    if (!startDate.getMonth)
      return startDate;
    else if (startDate.getMonth() === endDate.getMonth())
      return moment(startDate).format('MMMM D') + '-' + endDate.getDate() + moment(startDate).format(', YYYY');
    else
      return moment(startDate).format('MMMM D') + ' - ' + moment(endDate).format('MMMM D') + moment(startDate).format(', YYYY');
  }

  sendClickEvent(label){
    // Format section name string
    let section_name = this.title.charAt(0).toUpperCase() + this.title.toLowerCase().slice(1);
    // Send click event to GA
    this.googleAnalyticsService.sendSectionEvent(`${section_name} Section`, label);
  }
}
