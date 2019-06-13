import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import { ShopifyService } from "./shopify.service"

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private shopify: ShopifyService) {}

  cartSubject = new Subject();
  items = [];
  // cart:any;

  // TO DO REVRITE TO METHOD
  set cart(cartItem) {
    console.log(cartItem);
    
    let listItems = this.cart;
    let product = cartItem.product;
    let quantity = cartItem.quantity;
    let type = cartItem.type; //add or update

    let isItemPresented = this.isItemAlreadyAdded(listItems, product.activeOption ? product.activeOption.id : product.id);
    if(isItemPresented) {
      var index = this.getItemIndex(cartItem, listItems);
      type === 'update' ? listItems[index].quantity += quantity : listItems[index].quantity = quantity;
      listItems[index].product = product;
      localStorage.setItem('cart', JSON.stringify(listItems));
    } else {
      listItems.push({product, quantity});
      localStorage.setItem('cart', JSON.stringify(listItems));
    }
    //this.createUpdateShopifyCart(cartItem, isItemPresented);
    console.log(this.cart);

    this.cartSubject.next(this.cart);
  }

  getItemIndex(cartItem, cart) {
   return cart.findIndex(function (item) {
     let itemId = item.product.activeOption ? item.product.activeOption.id : item.product.id;
     let cartItemId = cartItem.product.activeOption ? cartItem.product.activeOption.id : cartItem.product.id;
     return itemId === cartItemId;
    });
  }

  createUpdateShopifyCart(cartItem, isItemPresented) {
    if(this.cartId) {
      let attr = { variantId: cartItem.product.activeOption ? cartItem.product.activeOption.id : cartItem.product.id, quantity: cartItem.quantity};
      isItemPresented ? this.shopify.updateCheckoutLI(this.cartId, [attr]) : this.shopify.addCheckoutLI(this.cartId, [attr]);
    } else {
      this.createCart();
    }
  }

  getCartFromCache() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  get cart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  get cartId() {
    return localStorage.getItem('cartId');
  }

  set cartId(id) {
    localStorage.setItem('cartId', id);
  }

  clearCart() {
    localStorage.removeItem('cart');
  }

  createCart() {
    this.shopify.createCheckout(this.lineItemsToAdd, []).then(
      (createdOrder) => {
        this.cartId = createdOrder.id;
      }
    );
  }

  get checkoutId() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  isItemAlreadyAdded(list, id) {
    return list.some(item => {
      let variantId = item.product.activeOption ? item.product.activeOption.id : item.product.id;
      return variantId === id
    })
  }

  removeItem(item) {
    let listItems = this.cart.filter((i) => {
      let variantId1 = item.product.activeOption ? item.product.activeOption.id : item.product.id;
      let variantId2 = i.product.activeOption ? i.product.activeOption.id : i.product.id;
      return variantId2 !== variantId1;
    });
    localStorage.setItem('cart', JSON.stringify(listItems));
    this.cartSubject.next(this.cart);
  }

  get lineItemsToAdd() {
    let lineItems = [];
    this.cart.forEach((item) => {
      let attr = {
        variantId: item.product.activeOption ? item.product.activeOption.id : item.product.id,
        quantity: item.quantity
      };
      lineItems.push(attr)
    });
    return lineItems;
  }

  getTotalQuantity(cart) {
    let total = 0;
    cart.map((item) => {
      total +=  item.quantity
    });
    return total;
  }

}
