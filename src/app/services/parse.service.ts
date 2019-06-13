import * as moment from "moment";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable()

export class ParseService {
  constructor() {
  }

  toCollection(collection) {
    let obj = this.getByTag(collection.descriptionHtml, /<data[^>]*>([\s\S]*?)<\/data>/gm);
    if (!obj)
      return collection;
    obj.productList = collection.products.map(product => this.toProduct(product));
    return { ...collection, ...obj };
    
    // collection.state = this.getByTag(collection.descriptionHtml, /<state[^>]*>([\s\S]*?)<\/state>/gm);
    // collection
    // collection.heroLinks = this.getByTag(collection.descriptionHtml, /<heroLinks[^>]*>([\s\S]*?)<\/heroLinks>/gm);
    // collection.menuLinks = this.getByTag(collection.descriptionHtml, /<menuLinks[^>]*>([\s\S]*?)<\/menuLinks>/gm);
    // collection.menuLinks ? collection.menuLinks.forEach(item => item.text = this.decodeHTML(item.text)) : collection.menuLinks;
    // collection.experienceRatingImages = this.getByTag(collection.descriptionHtml, /<experienceRatingImages[^>]*>([\s\S]*?)<\/experienceRatingImages>/gm);
    // collection.videoLinks = this.getByTag(collection.descriptionHtml, /<videoLinks[^>]*>([\s\S]*?)<\/videoLinks>/gm);
    // collection.galleryImages = this.getByTag(collection.descriptionHtml, /<galleryImages[^>]*>([\s\S]*?)<\/galleryImages>/gm);
    // collection.corporateLinks = this.getByTag(collection.descriptionHtml, /<corporateLinks[^>]*>([\s\S]*?)<\/corporateLinks>/gm);
    
    // return collection;
  }

  toProduct(product) {
    let obj = this.getByTag(product.descriptionHtml, /<data[^>]*>([\s\S]*?)<\/data>/gm);
    product.handleUrl = this.cleanUrls(product.handle);
    product.minPrice = this.getProductMinPrice(product);
    product.startDate = obj.startDate ? this.getDate(obj.startDate) : new Date();
    product.endDate = obj.endDate ? this.getDate(obj.endDate) : new Date();
    product.tagList = obj.tagList ? obj.tagList.split(',').map(tag => tag.trim()) : [];
    return { ...product, ...obj };
    // product.locationName = this.getByTag(product.descriptionHtml, /<locationName[^>]*>([\s\S]*?)<\/locationName>/gm);
    // product.locationAddress = this.getByTag(product.descriptionHtml, /<locationAddress[^>]*>([\s\S]*?)<\/locationAddress>/gm);
    // 
    // product.isPromoted = product.descriptionHtml.indexOf('<promoted>') > -1;
    // 
    // product.optionsObj = this.parseOptionsToObj(product.options);
    // product.promoImage = this.getByTag(product.descriptionHtml, /<promoImage[^>]*>([\s\S]*?)<\/promoImage>/gm);
    // product.category = this.getByTag(product.descriptionHtml, /<category[^>]*>([\s\S]*?)<\/category>/gm);
    // product.logoImage = this.getByTag(product.descriptionHtml, /<logoImage[^>]*>([\s\S]*?)<\/logoImage>/gm);
    // product.shortDescription = this.getByTag(product.descriptionHtml, /<shortDescription[^>]*>([\s\S]*?)<\/shortDescription>/gm);
    // product.startDate = this.getDate(this.getByTag(product.descriptionHtml, /<startDate[^>]*>([\s\S]*?)<\/startDate>/gm));
    // product.endDate = this.getDate(this.getByTag(product.descriptionHtml, /<endDate[^>]*>([\s\S]*?)<\/endDate>/gm));
    // product.tagList = this.getByTag(product.descriptionHtml, /<tagList[^>]*>([\s\S]*?)<\/tagList>/gm).split(',').map(tag => tag.trim());
    // return product;
  }

  cleanUrls(url) {
    let index = url.indexOf('___');
    return index < 0 ? url : url.split('___')[0];
  }

  parseOptionsToObj(options) {
    let newOptionsObj = {};
    options.forEach(el => {
      newOptionsObj[el.name] = {};

      el.values.forEach(element => {
        newOptionsObj[el.name][element.value] = {
          disabled: false,
          isActive: false
        };
      });
    })
    return newOptionsObj;
  }

  getByTag(description, pattern) {
    try {
      let exec = pattern.exec(description);
      if (exec && exec.length > 1) {
        let result = exec[1].trim();
        return result ? JSON.parse(result) : '';
      }
      return '';
    } catch (error) {
      // console.log(error.message);
      return '';
    }
  }

  getDate(dateString) {
    let dateArray = dateString.split('.');
    return dateArray.length > 2 ?
      new Date(dateArray[2], +dateArray[1] - 1, dateArray[0]) : 'Dates coming soon';
  } 

  updateBodyHtml(result, descriptionHtml) {
    let index = descriptionHtml.indexOf('<data>') + "data".length + 2;
    let indexLast = descriptionHtml.indexOf('</data>');
    if (index < 0 || indexLast < 0)
      return '<data>' + JSON.stringify(result) + '</data>' + descriptionHtml;
    let content = descriptionHtml.substring(index, indexLast);
    return descriptionHtml.replace(content, JSON.stringify(result));
  }

  setVariants(variants) {
    let dates = {};
    variants.forEach((variant) => {
      let productFirstOption = variant.title.split(' / ')[0].toString(); // Returns 2019 March 27
      let productSecondOption = '';
      if (variant.title.split(' / ')[1])
        productSecondOption = variant.title.split(' / ')[1].toString(); // Returns Brooklyn
      let convertedData = this.convertDateToIsoFormat(productFirstOption);
      let isoDate = moment(convertedData).format('YYYY-MM-DD');
      if (!dates[isoDate]) dates[isoDate] = this.productDate(convertedData);
      dates[isoDate].options.push(this.setDateOptions({ variant, productFirstOption, productSecondOption }));
    });
    return dates;
  }

  setDateOptions(data) {
    return {
      productFirstOption: data.productFirstOption,
      productSecondOption: data.productSecondOption,

      available: data.variant.available,
      hasTicket: data.productSecondOption.indexOf('ADD TICKETS TO MY ORDER') !== -1 ? false : true,
      id: data.variant.id,
      price: parseInt(data.variant.price),
      isSelected: false
    }
  }

  productDate(convertedData) {
    return {
      options: [],
      isSelected: false,
      formatted: {
        isoDate: moment(convertedData).format('YYYY-MM-DD'),
        fullHumanDate: {
          date: moment(convertedData).format('MMMM, D'),
          dayOfWeek: moment(convertedData).format('dddd'),
        },
        shortHumanDate: {
          date: moment(convertedData).format('MMM D'),
          dayOfWeek: moment(convertedData).format('ddd'),
        }
      }
    };
  }

  convertDateToIsoFormat(date) {
    let d = date.split(' ').reverse().toString().replace(/,/g, ' ');
    return new Date(d);
  }

  getHighestPriceProduct(variantByCollection) {
    let collections = [].concat(variantByCollection);
    return collections.sort(function (a, b) {
      return (a.variantByCollection.price < b.variantByCollection.price) ? -1 : ((a.variantByCollection.price > b.variantByCollection.price) ? 1 : 0);
    })[0]
  }

  removeHighestPriceProduct(products, id) {
    return products.filter(product => product.id !== id);
  }

  getProductMinPrice(product) {
    // let minPrice;
    // let allPrices = [];
    // let dates = product.dates || {};
    // for (var key in dates) {
    //   let dayOptions = dates[key].options || [];
    //   dayOptions.forEach((o) => { allPrices.push(o.price) })
    // }
    // minPrice = allPrices.sort((a, b) => a - b)[0];
    return product.variants.reduce((prev, curr) => { return Number(curr.price) > prev ? curr.price : prev });
  }

  getTag(product) {
    let tagPattern = /<topLabel[^>]*>([\s\S]*?)<\/topLabel>/gm;
    let tag = tagPattern.exec(product.descriptionHtml);
    if (tag && tag.length > 1) return tag[1];
  }

  decodeHTML(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  };
}
