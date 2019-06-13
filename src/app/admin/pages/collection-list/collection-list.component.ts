import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CacheService } from "../../../services/cache.service";
import { environment } from "../../../../environments/environment";
import { SubscribeBusService } from "../../../state.management/subscribeBus";
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'admin-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminCollectionListComponent implements OnInit {
  collectionDataArray: any[];
  showSpinner: boolean = true;

  constructor(
    private subscribeBusService: SubscribeBusService,
    private cacheService: CacheService,
  ) { }

  ngOnInit() {
    this.subscribeBusService.showSpinner.subscribe(value => {
      this.showSpinner = value;
    });
    this.cacheService.getAllCollections().then(array => this.collectionDataArray = array);
  }

}
