import { Component, ViewEncapsulation, HostListener, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CacheService } from "../../../services/cache.service";
import { ParseService } from "../../../services/parse.service";
import { BackendApiService } from "../../../services/backend-api.service";
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from "../../../../environments/environment";
import { BackendMethod, BackendCollectionState } from '../../../models/backend.api.model';
import { SubscribeBusService } from "../../../state.management/subscribeBus";
import * as moment from 'moment';

@Component({
  selector: 'admin-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class AdminEditProductComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  product: any;
  showSpinner: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private subscribeBusService: SubscribeBusService,
    private parseService: ParseService,
    private backendApiService: BackendApiService
  ) { }

  ngOnInit() {
    this.subscribeBusService.showSpinner.subscribe(value => {
      this.showSpinner = value;
    });

    let collectionUrl = this.route.params['value'].collectionUrl;
    let productUrl = this.route.params['value'].productUrl;
    this.cacheService.getCollection(collectionUrl).then(collection => {
      this.product = collection.products.filter(product => product.handle === productUrl)[0];
      this.form = this.getUpdatedForm(this.product, this.form);
    });
  }

  getUpdatedForm(product, currentForm) {
    let form = {};
    if (product.tagList)
      product.tagList.forEach((item, index) => {
        let tag = currentForm.get('tag' + index) ? currentForm.get('tag' + index).value : '';
        form['tag' + index] = new FormControl(tag || item || '', { updateOn: 'change' });
      });
    if (!product.startDate)
      product.startDate = '';
    form['startDate'] = new FormControl(currentForm.get('startDate') && currentForm.get('startDate').value || moment(product.startDate).format('D.MM.YYYY') || '', { updateOn: 'change' });
    if (!product.endDate)
      product.endDate = '';
    form['endDate'] = new FormControl(currentForm.get('endDate') && currentForm.get('endDate').value || moment(product.endDate).format('D.MM.YYYY') || '', { updateOn: 'change' });
    if (!product.logoImage)
      product.logoImage = '';
    form['logoImage'] = new FormControl(currentForm.get('logoImage') && currentForm.get('logoImage').value || product.logoImage || '', { updateOn: 'change' });
    if (!product.category)
      product.category = '';
    form['category'] = new FormControl(currentForm.get('category') && currentForm.get('category').value || product.category || '', { updateOn: 'change' });
    if (!product.promoImage)
      product.promoImage = '';
    form['promoImage'] = new FormControl(currentForm.get('promoImage') && currentForm.get('promoImage').value || product.promoImage || '', { updateOn: 'change' });
    if (!product.shortDescription)
      product.shortDescription = '';
    form['shortDescription'] = new FormControl(currentForm.get('shortDescription') && currentForm.get('shortDescription').value || product.shortDescription || '', { updateOn: 'change' });
    if (!product.locationUrl)
      product.locationUrl = '';
    form['locationUrl'] = new FormControl(currentForm.get('locationUrl') && currentForm.get('locationUrl').value || product.locationUrl || '', { updateOn: 'change' });
    if (!product.locationName)
      product.locationName = '';
    form['locationName'] = new FormControl(currentForm.get('locationName') && currentForm.get('locationName').value || product.locationName || '', { updateOn: 'change' });
    if (!product.locationAddress)
      product.locationAddress = '';
    form['locationAddress'] = new FormControl(currentForm.get('locationAddress') && currentForm.get('locationAddress').value || product.locationAddress || '', { updateOn: 'change' });
    return new FormGroup(form);
  }

  getUpdatedCollection(product) {
    let tag_array = [];
    product.tagList.forEach((slide, index) => {
      tag_array.push(this.form.get('tag' + index).value);
    });
    let tagList = tag_array.join();
    let startDate = this.form.get('startDate').value;
    let endDate = this.form.get('endDate').value;
    let logoImage = this.form.get('logoImage').value;
    let category = this.form.get('category').value;
    let promoImage = this.form.get('promoImage').value;
    let shortDescription = this.form.get('shortDescription').value;
    let locationUrl = this.form.get('locationUrl').value;
    let locationName = this.form.get('locationName').value;
    let locationAddress = this.form.get('locationAddress').value;
    return {
      tagList: tagList,
      startDate: startDate,
      endDate: endDate,
      logoImage: logoImage,
      category: category,
      promoImage: promoImage,
      shortDescription: shortDescription,
      locationUrl: locationUrl,
      locationName: locationName,
      locationAddress: locationAddress
    };
  }

  addRow(arrayName, obj) {
    for (let prop in obj)
      obj[prop] = '';
    this.product[arrayName].push(obj);
    this.form = this.getUpdatedForm(this.product, this.form);
  }

  removeRow(arrayName, index) {
    this.product[arrayName].splice(index, 1);
    this.form = this.getUpdatedForm(this.product, this.form);
  }

  onSubmit() {
    this.subscribeBusService.showSpinner.next(true);

    let result = this.getUpdatedCollection(this.product);
    let bodyHtml = this.parseService.updateBodyHtml(result, this.product.descriptionHtml);
    this.backendApiService.updateDescription(BackendMethod.editProduct, bodyHtml, this.product.id).then(res => this.subscribeBusService.showSpinner.next(false));;
  }
}
