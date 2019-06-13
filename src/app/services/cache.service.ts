import { Injectable } from '@angular/core';
import { ShopifyService } from '../services/shopify.service';
import { ParseService } from '../services/parse.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private collectionData = {};
  private collectionDataArray = [];
  queryPromise: Promise<any>;

  constructor(
    private shopifyService: ShopifyService,
    private parseService: ParseService,
  ) {
    // this.queryPromise = this.shopifyService.getProductsByCollectionId(environment.first_collection_id).then(data => {
    //   if (data && data.products) {
    //     this.products = data.products.map(product => this.parseService.toProduct(product));
    //     this.setData(this.products);
    //     this.queryPromise = null;
    //   }
    // });
    this.queryPromise = this.shopifyService.getAllCollections().then(data => {
      if (data && data.length > 0) {
        let collections = data.map(collection => {
          let parsed = this.parseService.toCollection(collection);
          this.collectionData[collection.handle] = parsed;
          this.collectionDataArray.push(parsed);
        });
        this.queryPromise = null;
      }
    });
  }

  getCollection(id): Promise<any> {
    if (this.queryPromise)
      return this.queryPromise.then(data => this.collectionData[id]);
    return new Promise((resolve, reject) => resolve(this.collectionData[id]));
  }

  getAllCollections(): Promise<any> {
    if (this.queryPromise)
      return this.queryPromise.then(data => this.collectionDataArray);
    return new Promise((resolve, reject) => resolve(this.collectionDataArray));
  }
}