import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CacheService } from "../../../services/cache.service";
import { ParseService } from "../../../services/parse.service";
import { BackendApiService } from "../../../services/backend-api.service";
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from "../../../../environments/environment";
import { BackendMethod, BackendCollectionState } from '../../../models/backend.api.model';
import { SubscribeBusService } from "../../../state.management/subscribeBus";

@Component({
  selector: 'admin-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class AdminEditCollectionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  collection: any;
  states: any;
  activeTab: string = "";
  showModal: boolean = false;
  modalContent: any;
  showSpinner: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private subscribeBusService: SubscribeBusService,
    private parseService: ParseService,
    private backendApiService: BackendApiService
  ) {
    this.states = Object.keys(BackendCollectionState).map(key => ({ value: BackendCollectionState[key], title: key }));
  }

  ngOnInit() {
    this.subscribeBusService.showSpinner.subscribe(value => {
      this.showSpinner = value;
    });

    let collectionUrl = this.route.params['value'].collectionUrl;
    this.cacheService.getCollection(collectionUrl).then(collection => {
      this.collection = collection;
      console.log(this.collection);

      this.form = this.getUpdatedForm(collection, this.form);
    });
  }

  getUpdatedForm(collection, currentForm) {
    let form = {};

    // HERO SLIDER
    if (!collection.slides)
      collection.slides = [{ img: '', url: '' }];
    collection.slides.forEach((item, index) => {
      let slideImg = currentForm.get('slideImg' + index) ? currentForm.get('slideImg' + index).value : '';
      let slideUrl = currentForm.get('slideUrl' + index) ? currentForm.get('slideUrl' + index).value : '';
      form['slideImg' + index] = new FormControl(slideImg || item.img || '', { updateOn: 'change' });
      form['slideUrl' + index] = new FormControl(slideUrl || item.url || '', { updateOn: 'change' });
    });
    // EO HERO SLIDER


    // HERO LINKS
    if (!collection.heroLinks)
      collection.heroLinks = [];
    collection.heroLinks.forEach((item, index) => {
      let heroLinkUrl = currentForm.get('heroLinkUrl' + index) ? currentForm.get('heroLinkUrl' + index).value : '';
      let heroLinkText = currentForm.get('heroLinkText' + index) ? currentForm.get('heroLinkText' + index).value : '';
      form['heroLinkUrl' + index] = new FormControl(heroLinkUrl || item.url || '', { updateOn: 'change' });
      form['heroLinkText' + index] = new FormControl(heroLinkText || item.text || '', { updateOn: 'change' });
    });
    // EO HERO LINKS


    // MENU LINKS
    if (!collection.menuLinks)
      collection.menuLinks = [];
    collection.menuLinks.forEach((item, index) => {
      let menuLinkUrl = currentForm.get('menuLinkUrl' + index) ? currentForm.get('menuLinkUrl' + index).value : '';
      let menuLinkText = currentForm.get('menuLinkText' + index) ? currentForm.get('menuLinkText' + index).value : '';
      form['menuLinkUrl' + index] = new FormControl(menuLinkUrl || item.url || '', { updateOn: 'change' });
      form['menuLinkText' + index] = new FormControl(menuLinkText || item.text || '', { updateOn: 'change' });
    });
    // EO MENU LINKS


    // CORPORATE LINKS
    if (!collection.corporateLinks)
      collection.corporateLinks = [];
    collection.corporateLinks.forEach((item, index) => {
      let corporateLinkUrl = currentForm.get('corporateLinkUrl' + index) ? currentForm.get('corporateLinkUrl' + index).value : '';
      let corporateLinkText = currentForm.get('corporateLinkText' + index) ? currentForm.get('corporateLinkText' + index).value : '';
      form['corporateLinkUrl' + index] = new FormControl(corporateLinkUrl || item.url || '', { updateOn: 'change' });
      form['corporateLinkText' + index] = new FormControl(corporateLinkText || item.text || '', { updateOn: 'change' });
    });
    // EO CORPORATE LINKS


    // RATING SECTION IMAGES
    if (!collection.experienceRatingImages)
      collection.experienceRatingImages = [];
    collection.experienceRatingImages.forEach((item, index) => {
      let experienceRatingImages = currentForm.get('experienceRatingImages' + index) ? currentForm.get('experienceRatingImages' + index).value : '';
      form['experienceRatingImages' + index] = new FormControl(experienceRatingImages || item || '', { updateOn: 'change' });
    });
    // EO RATING SECTION IMAGES


    // gallery IMAGES
    if (!collection.galleryImages)
      collection.galleryImages = { guests: [""], venue: [""], shows: [""] };
    collection.galleryImages.guests.forEach((item, index) => {
      let galleryGuestImages = currentForm.get('galleryGuestImages' + index) ? currentForm.get('galleryGuestImages' + index).value : '';
      form['galleryGuestImages' + index] = new FormControl(galleryGuestImages || item || '', { updateOn: 'change' });
    });
    if (!collection.galleryImages)
      collection.galleryImages = { guests: [""], venue: [""], shows: [""] };
    collection.galleryImages.venue.forEach((item, index) => {
      let galleryVenuesImages = currentForm.get('galleryVenuesImages' + index) ? currentForm.get('galleryVenuesImages' + index).value : '';
      form['galleryVenuesImages' + index] = new FormControl(galleryVenuesImages || item || '', { updateOn: 'change' });
    });
    if (!collection.galleryImages)
      collection.galleryImages = { guests: [""], venue: [""], shows: [""] };
    collection.galleryImages.shows.forEach((item, index) => {
      let galleryShowsImages = currentForm.get('galleryShowsImages' + index) ? currentForm.get('galleryShowsImages' + index).value : '';
      form['galleryShowsImages' + index] = new FormControl(galleryShowsImages || item || '', { updateOn: 'change' });
    });
    // EO gallery IMAGES


    // VIDEO LINKS
    if (!collection.videoLinks)
      collection.videoLinks = { bgVideoUrl: "", mainVideoUrl: "" };
    form['bgVideoUrl'] = new FormControl(currentForm.get('bgVideoUrl') && currentForm.get('bgVideoUrl').value || collection.videoLinks.bgVideoUrl || '', { updateOn: 'change' });
    form['mainVideoUrl'] = new FormControl(currentForm.get('mainVideoUrl') && currentForm.get('mainVideoUrl').value || collection.videoLinks.mainVideoUrl || '', { updateOn: 'change' });
    // EO VIDEO LINKS


    if (!collection.state)
      collection.state = '';
    form['state'] = new FormControl(currentForm.get('state') && currentForm.get('state').value || collection.state || '', { updateOn: 'change' });
    return new FormGroup(form);
  }

  getUpdatedCollection(collection) {
    let slides = [];
    let heroLinks = [];
    let menuLinks = [];
    let corporateLinks = [];
    let experienceRatingImages = [];
    let galleryImages = {
      guests: [],
      venue: [],
      shows: []
    }

    collection.slides.forEach((slide, index) => {
      let obj = {
        url: this.form.get('slideUrl' + index).value,
        img: this.form.get('slideImg' + index).value
      }
      slides.push(obj);
    });

    collection.heroLinks.forEach((slide, index) => {
      let obj = {
        url: this.form.get('heroLinkUrl' + index).value,
        text: this.form.get('heroLinkText' + index).value
      }
      heroLinks.push(obj);
    });

    collection.menuLinks.forEach((slide, index) => {
      let obj = {
        url: this.form.get('menuLinkUrl' + index).value,
        text: this.form.get('menuLinkText' + index).value
      }
      menuLinks.push(obj);
    });

    collection.corporateLinks.forEach((slide, index) => {
      let obj = {
        url: this.form.get('corporateLinkUrl' + index).value,
        text: this.form.get('corporateLinkText' + index).value
      }
      corporateLinks.push(obj);
    });

    collection.experienceRatingImages.forEach((slide, index) => {
      let obj = this.form.get('experienceRatingImages' + index).value;
      experienceRatingImages.push(obj);
    });

    // gallery IMAGES
    collection.galleryImages.guests.forEach((guest, index) => {
      let obj = this.form.get('galleryGuestImages' + index).value;
      galleryImages.guests.push(obj);
    });
    collection.galleryImages.venue.forEach((venue, index) => {
      let obj = this.form.get('galleryVenuesImages' + index).value;
      galleryImages.venue.push(obj);
    });
    collection.galleryImages.shows.forEach((show, index) => {
      let obj = this.form.get('galleryShowsImages' + index).value;
      galleryImages.shows.push(obj);
    });
    // EO gallery IMAGES

    let videoLinks = {
      bgVideoUrl: this.form.get('bgVideoUrl').value,
      mainVideoUrl: this.form.get('mainVideoUrl').value
    };
    let state = this.form.get('state').value;
    return {
      state: state,
      videoLinks: videoLinks,
      slides: slides,
      heroLinks: heroLinks,
      menuLinks: menuLinks,
      experienceRatingImages: experienceRatingImages,
      galleryImages: galleryImages,
      corporateLinks: corporateLinks
    };
  }

  addRow(arrayName, obj) {
    for (let prop in obj)
      obj[prop] = '';
    this.collection[arrayName].push(obj);
    this.form = this.getUpdatedForm(this.collection, this.form);
  }

  addRowToObj(propName, arrayName, obj) {
    for (let prop in obj)
      obj[prop] = '';
    this.collection[propName][arrayName].push(obj);
    this.form = this.getUpdatedForm(this.collection, this.form);
  }

  removeRow(arrayName, index) {
    this.collection[arrayName].splice(index, 1);
    this.form = this.getUpdatedForm(this.collection, this.form);
    if (this.showModal) {
      this.dismissPopUp();
    }
  }

  removeRowFromObj(propName, arrayName, index) {
    this.collection[propName][arrayName].splice(index, 1);
    this.form = this.getUpdatedForm(this.collection, this.form);
    if (this.showModal) {
      this.dismissPopUp();
    }
  }

  onSubmit() {
    this.subscribeBusService.showSpinner.next(true);

    let result = this.getUpdatedCollection(this.collection);
    let bodyHtml = this.parseService.updateBodyHtml(result, this.collection.descriptionHtml);
    this.backendApiService.updateDescription(this.collection.handle == environment.configCollectionUrl ?
      BackendMethod.editCustomCollection : BackendMethod.editSmartCollection, bodyHtml, this.collection.id).then(res => this.subscribeBusService.showSpinner.next(false));
  }

  // SHOW DELETE CONFIRMATION MODAL
  showConfirmationModal(propName, arrayName, index) {
    let type = 'item';
    if(propName === 'videoLinks'){
      type = 'video';
    }else if (typeof arrayName === 'string' && arrayName.toLowerCase().indexOf('image') > -1){
      type = 'image';
    }
    this.modalContent = { propName, type, arrayName, index };
    this.showModal = true;
  }

  // DISMISS POPUP MODAL
  dismissPopUp() {
    this.showModal = false;
    this.modalContent = {};
  }

  // GET VIDEO / IMAGE THUMBNAIL
  getThumbnail(src) {
    //Default thumbnail
    let thumb = 'https://via.placeholder.com/80x80';
    // Check if src comes from cloudinary
    if (src && src.split('/').length > 1) {
      let hostname = src.split('/')[2];
      if (hostname === 'res.cloudinary.com') {
        thumb = src.replace(/upload\/q_auto|upload/g, 'upload/w_80,h_80,c_fill,g_auto');
        // Check file extension
        if (thumb.split('.').pop() === 'mp4') {
          // Update file extension
          return thumb.substr(0, thumb.lastIndexOf(".")) + ".jpg";
        }
      }
    }
    return thumb;
  }

}
