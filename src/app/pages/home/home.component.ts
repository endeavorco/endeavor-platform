import { Component, OnInit } from "@angular/core";
import { environment } from '../../../environments/environment';
import { CacheService } from "src/app/services/cache.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  environment = environment;
  configCollection: any;
  discoverCollection: any[];
  artCollection: any[];
  musicCollection: any[];
  sportsCollection: any[];

  constructor(private cacheService: CacheService) {}

  ngOnInit() {
    this.cacheService.getCollection(environment.configCollectionUrl).then(collection => {
      this.configCollection = collection;
    });
    this.cacheService.getCollection(environment.discoverCollectionUrl).then(collection => {
      this.discoverCollection = collection;
    });
    this.cacheService.getCollection(environment.fashionCollectionUrl).then(collection => {
      this.artCollection = collection;
    });
    this.cacheService.getCollection(environment.musicCollectionUrl).then(collection => {
      this.musicCollection = collection;
    });
    this.cacheService.getCollection(environment.sportsCollectionUrl).then(collection => {
      this.sportsCollection = collection;
    });
  }
}

