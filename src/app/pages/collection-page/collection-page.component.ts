import { Component, ViewEncapsulation, HostListener, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { environment } from "../../../environments/environment";
import { ModalService } from "src/app/services/modal.service";

@Component({
  selector: 'app-collection-page',
  templateUrl: './collection-page.component.html',
  styleUrls: ['./collection-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionPageComponent implements OnInit {

  @Input() collection: any;

  sliderConfig = { autoWidth: true, items: 1.3, gutter: 15 };

  selectedProduct: any;
  avaliableVariants = [];
  routerEventsSubs;
  isSoldOut: boolean = false;
  isCheckoutInProgress: boolean = false;
  isFooterSelectBoxActive: boolean = false;
  showDatesSelector: boolean = false;
  stickyShowMoreOptions: boolean = false;
  showHintTooltip: boolean = false;
  isChooseOptionsInProgress: boolean = true;
  environment = environment;
  checkoutButtonText: string = '';//environment.default_checkout_text;
  confirmItemAdded = false;
  isSelectBoxActive: boolean = false;
  pageOptions: any = {
    quantity: 1,
    isValidOrder: false,
    isDateOptionSelected: false,
    price: 0,
    date: {
      formatted: {}
    },
    tickets: {
      selected: false,
      active: false
    }
  };

  optionsObj = [];
  selectedOptionsArr = [];
  activeTab: string = "";
  currentRoute: string = '';

  @ViewChild('datesSelector', null) datesSelector: ElementRef;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.checkSize();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.currentRoute = this.route.snapshot.params.collectionUrl;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkSize();
    }, 500);

    // This tracking event hasn't been requested yet - will uncomment once requested
    // this.googleAnalyticsService.sendOptimizeEvent('product_page_loaded');
  }

  ngOnDestroy() {
    if (this.routerEventsSubs) this.routerEventsSubs.unsubscribe();
  }

  createCart(product) {

    if (this.isChooseOptionsInProgress) {
      this.showHintTooltip = true;
      setTimeout(() => this.showHintTooltip = false, 4000);
      return
    }

    let order = {
      id: product.activeOption.id,
      title: product.activeOption.title,
      price: product.activeOption.price,
      quantity: parseInt(this.pageOptions.quantity),
      productTitle: product.title,
      image: product.images[0].src
    };

    this.cartService.cart = { type: 'update', product: order, quantity: this.parseInt(order.quantity) };
    // this.googleAnalyticsService.addToCart(order, this.parseInt(order.quantity));
    this.showSuccessAddInfo();
  }

  parseProductOptionsObj(optionsObj) {
    let productOtionsArr = [];

    Object.keys(optionsObj).map((option, i) => {
      let obj = {
        name: option,
        values: []
      };
      productOtionsArr.push(obj);
      Object.keys(optionsObj[option]).map(el => {
        productOtionsArr[i].values.push({
          name: el,
          disabled: !!optionsObj[option][el].disabled,
          isActive: !!optionsObj[option][el].isActive
        })
      });
    });

    return productOtionsArr;
  }

  setOptionAsActive(selectedProduct, selectedOption) {

    this.diactivateOtiopns(selectedProduct);
    this.handleSelectedOptions(selectedProduct, selectedOption);
    this.filterVariants(selectedProduct);
    this.handleOptionsState(selectedProduct);
    this.addVariantToCart(selectedProduct);

    this.optionsObj = this.parseProductOptionsObj(selectedProduct.optionsObj);
  }

  diactivateOtiopns(selectedProduct) {
    Object.keys(selectedProduct.optionsObj).forEach(option => {
      Object.keys(selectedProduct.optionsObj[option]).forEach(el => {
        selectedProduct.optionsObj[option][el].disabled = true;
        selectedProduct.optionsObj[option][el].isActive = false;
      });
    });
  }

  activateOtiopns(selectedProduct) {
    Object.keys(selectedProduct.optionsObj).forEach(option => {
      Object.keys(selectedProduct.optionsObj[option]).forEach(el => {
        selectedProduct.optionsObj[option][el].disabled = false;
        selectedProduct.optionsObj[option][el].isActive = false;
      });
    });
  }

  handleSelectedOptions(selectedProduct, selectedOption) {
    // handle selected options (filters for variants)
    if (this.selectedOptionsArr.indexOf(selectedOption) != -1) {
      this.selectedOptionsArr.splice(this.selectedOptionsArr.indexOf(selectedOption), 1);
      if (this.selectedOptionsArr.length == 0)
        this.activateOtiopns(selectedProduct);
    } else {
      this.selectedOptionsArr.push(selectedOption);
    }
  }

  filterVariants(selectedProduct) {
    // filter available variants
    this.avaliableVariants = selectedProduct.variants.filter(variant =>
      this.selectedOptionsArr.length != 0 && this.selectedOptionsArr
        .map(option => variant.available && variant.selectedOptions.filter(el => option == el.value).length > 0)
        .reduce((acc, cum) => acc && cum)
    );
    console.log("Avaliable Variants", this.avaliableVariants);
  }

  handleOptionsState(selectedProduct) {
    // set isActive selected options and disable unavailable
    this.avaliableVariants.forEach(avaliableVariant => {
      avaliableVariant.selectedOptions.forEach(avaliableVariantOption => {
        this.selectedOptionsArr.forEach(el => {
          if (el == avaliableVariantOption.value) {
            selectedProduct.optionsObj[avaliableVariantOption.name][avaliableVariantOption.value].isActive = true;
          }
          selectedProduct.optionsObj[avaliableVariantOption.name][avaliableVariantOption.value].disabled = false;
        });
      });
    });
  }

  addVariantToCart(selectedProduct) {
    if (this.avaliableVariants.length == 1) {
      selectedProduct.activeOption = this.avaliableVariants[0];
      this.isChooseOptionsInProgress = false;
    } else {
      this.isChooseOptionsInProgress = true;
    }
  }

  checkIfDateAvailable(item) {
    return item.value.options.some(x => x.available && x.hasTicket == this.pageOptions.tickets.active);
  }

  checkIfVariantAvailable(val) {
    if (!this.pageOptions.date.options)
      return true;
    return this.pageOptions.date.options.some(x => x.available && x.hasTicket == val);
  }

  checkIfSoldOut() {
    if (!this.pageOptions.date.options)
      return true;
    return this.pageOptions.date.options.every(x => !x.available);
  }

  selectQny(qny) {
    this.pageOptions.quantity = qny;
    this.isSelectBoxActive = false;
    this.isFooterSelectBoxActive = false;
    this.countPrice();
  }

  countPrice() {
    console.log(this.pageOptions);

    if (this.pageOptions.isDateOptionSelected && this.pageOptions.tickets.selected) {
      this.pageOptions.price = this.getActiveOption().price * this.pageOptions.quantity;
      this.pageOptions.isValidOrder = true;
    } else
      this.pageOptions.isValidOrder = false;
  }

  openFooterQuantities() {
    this.isFooterSelectBoxActive = !this.isFooterSelectBoxActive;
  }

  parseInt(qny) {
    return parseInt(qny)
  }

  checkSize() {
    if (this.datesSelector && this.datesSelector.nativeElement.getClientRects()[0]) {
      if (this.showDatesSelector !== this.datesSelector.nativeElement.getClientRects()[0].bottom > window.innerHeight) {
        this.showDatesSelector = this.datesSelector.nativeElement.getClientRects()[0].bottom > window.innerHeight;
        if (!this.showDatesSelector) this.isFooterSelectBoxActive = false;
      }
    }
  }

  gotoDetailProductPage(product) {
    this.router.navigate(['/event', product.id]);
  }

  gotoCart() {
    //this.router.navigate(['/cart']);
  }

  showStickyOptions() {
    this.stickyShowMoreOptions = true;
  }

  getParents(elem) {
    let parents = [];
    for (; elem && elem !== document; elem = elem.parentNode) {
      parents.push(elem);
    }
    return parents;
  }

  showSuccessAddInfo() {
    this.confirmItemAdded = true;
    // this.checkoutButtonText = environment.added_checkout_text;
    // setTimeout(() => {
    //   this.checkoutButtonText = environment.default_checkout_text;
    // }, 500)
  }

  changeTicketOption(value) {
    this.pageOptions.tickets.selected = true;
    this.pageOptions.tickets.active = value;
    this.countPrice();
  }

  getActiveOption() {
    return this.pageOptions.date.options.filter((o) => {
      return o.hasTicket === this.pageOptions.tickets.active
    })[0];
  }

  openQuantities() {
    this.isSelectBoxActive = !this.isSelectBoxActive;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
