import { Component, OnInit } from "@angular/core";
import { environment } from '../../../environments/environment';
import { CacheService } from "src/app/services/cache.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  environment = environment;
  discoverCollection: any;
  urlParam: string;

  constructor(private cacheService: CacheService, private route: ActivatedRoute) {
    this.urlParam = this.route.snapshot.data['url'];
  }

  ngOnInit() {
    this.cacheService.getCollection(this.urlParam).then(collection => {
      this.discoverCollection = collection;
    })
  }
}

