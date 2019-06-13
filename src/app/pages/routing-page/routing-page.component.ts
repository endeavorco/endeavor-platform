import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { CacheService } from "../../services/cache.service";

@Component({
  selector: 'app-routing-page',
  templateUrl: './routing-page.component.html',
  styleUrls: ['./routing-page.component.scss']
})
export class RoutingPageComponent implements OnInit {
  collection: any;
  selectedProduct: any;
  avaliableVariants = [];

  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheService
  ) { }

  ngOnInit() {
    let collectionUrl = this.route.params['value'].collectionUrl;
    this.cacheService.getCollection(collectionUrl).then(collection => {
      this.collection = collection;
    });
  }
}
