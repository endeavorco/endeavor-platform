import GraphQLJSClient from "graphql-js-client";
import typeBundle from "./types";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Product } from "./../models/product.model";
import Client from 'shopify-buy';

@Injectable()
export class ShopifyService {

  clientX: any = Client.buildClient({
    domain: environment.domain,
    storefrontAccessToken: environment.shopifyaccesstoken
  });

  client = new GraphQLJSClient(typeBundle, {
    url: `https://${environment.domain}/api/graphql`,
    fetcherOptions: {
      headers: {
        'X-Shopify-Storefront-Access-Token': environment.shopifyaccesstoken
      }
    }
  });

  getProducts(): Promise<Product[]> {

    let query = this.client.query((root) => {
      root.add('shop', (shop) => {
        shop.addConnection('products', { args: { first: 250 } }, (products) => {
          products.add('id');
          products.add('title');
          // products.addConnection('images', { args: { first: 250 } }, (images) => {
          //   images.add('src');
          //   images.add('id');
          //   images.add('altText');
          // })
          products.addConnection('variants', { args: { first: 250 } }, (variants) => {
            variants.add('id');
            variants.add('product');
            variants.add('title');
            variants.add('price');
            variants.add('image', (image) => {
              image.add('src');
              image.add('id');
              image.add('altText');
            })
          })
        })
      })
    });

    return this.client.send(query).then(({ model, data }) => {
      return this.client.fetchAllPages(model.shop.products, { pageSize: 20 })
    });

  }


  getProductById(_id): Promise<Product> {

    let client = this.client;

    let query = client.query((root) => {
      root.add('node', { args: { id: _id }, alias: 'product' }, (node) => {
        node.add('id');
        node.addInlineFragmentOn('Product', (Product) => {
          Product.add('title');
          Product.add('createdAt');
          Product.add('description');
          Product.add('descriptionHtml');
          Product.add('productType');
          Product.add('publishedAt');
          Product.add('tags');
          Product.add('updatedAt');
          Product.add('vendor');
          Product.addConnection('images', { args: { first: 250 } }, (images) => {
            images.add('src');
            images.add('id');
            images.add('altText');
          })
          Product.addConnection('variants', { args: { first: 250 } }, (variants) => {
            variants.add('id');
            variants.add('product');
            variants.add('title');
            variants.add('price');
            variants.add('available');
            variants.add('image', (image) => {
              image.add('src');
              image.add('id');
              image.add('altText');
            })
          })
        })
      })
    });

    return client.send(query).then(({ model, data }) => {
      return client.fetchAllPages(model.product, { pageSize: 250 })
    });

  }


  getAllCollections(): Promise<any> {
    return this.clientX.collection.fetchAllWithProducts();
  }


  getAllCollectionsWithoutProducts() {
    //let id = Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzQyNTAzNzAwNTQw
    return this.clientX.collection.fetchAll();
  }

  getProductsByCollectionId(id): Promise<any> {
    return this.clientX.collection.fetchWithProducts(id);
  }

  createCheckout(_lineItems, attrArray): Promise<any> {
    return this.clientX.checkout.create().then((checkout) => {
      this.updateCheckoutAttrs(checkout.id, attrArray);
      return this.addCheckoutLI(checkout.id, _lineItems);
    });
  }

  addCheckoutLI(checkoutId, _lineItems): Promise<any> {
    return this.clientX.checkout.addLineItems(checkoutId, _lineItems).then((checkout) => {
      return checkout;
    });
  }

  removeCheckoutLI(checkoutId, lineItemIdsToRemove): Promise<any> {
    return this.clientX.checkout.removeLineItems(checkoutId, lineItemIdsToRemove).then((checkout) => {
      return checkout;
    });
  }

  updateCheckoutLI(checkoutId, _lineItems): Promise<any> {
    return this.clientX.checkout.updateLineItems(checkoutId, _lineItems).then((checkout) => {
      return checkout;
    });
  }

  updateCheckoutAttrs(_checkoutid, attrArray): Promise<any> {
    // WARNING: all values should be strings.
    const input = { customAttributes: attrArray };
    // const input = {customAttributes: [
    //   {key: "consent_1", value: 'true'},
    //   {key: "consent_2", value: 'true'},
    //   {key: "contacts", value: '123'},
    //   {key: "attendee", value: "Ori"}
    // ]};
    // const input = {customAttributes: [
    //   {key: "Attendee name (if different from purchaser)", value: "Ori Birnbaum"},
    //   {key: "Attendee phone number + email (if different from purchaser)", value: "4242704863"},
    //   {key: "I consent to Endeavor Experiences, LLC keeping me informed by email about its products, services, and content. I understand that I can withdraw my consent at any time as set out in the Privacy Policy.", value: "Yes"},
    //   {key: "I confirm that I have read and agreed to the Purchase Policy and Terms of Use and read and acknowledged the Privacy Policy and Cookie Policy.  I confirm that I have the capacity to enter into a valid contract.", value: "Yes"}
    // ]};
    console.log(input);
    return this.clientX.checkout.updateAttributes(_checkoutid, input).then((checkout) => {
      return checkout;
    });
  }

  // TODO: probably remove?
  createCheckoutGQL(_lineItems): Promise<any> {
    const input = this.client.variable('input', 'CheckoutCreateInput!');
    const mutation = this.client.mutation('myMutation', [input], (root) => {
      root.add('checkoutCreate', { args: { input } }, (checkoutCreate) => {
        checkoutCreate.add('checkout', (checkout) => {
          checkout.add('id'),
            checkout.addConnection('lineItems', { args: { first: 250 } }, (lineItems) => {
              lineItems.add('variant', (variant) => { variant.add('title'); }),
                lineItems.add('quantity');
            }
            );
        });
      });
    });

    return this.client.send(mutation, { 'input': { lineItems: _lineItems } }).then(
      (response) => {
        return this.fetchCheckout(response.data.checkoutCreate.checkout.id);
      }
    );
  }

  fetchCheckout(_checkoutid): Promise<any> {
    const id = this.client.variable('checkoutId', 'ID!');
    let query = this.client.query((root) => {
      root.add('node', { args: { id: _checkoutid }, alias: 'checkout' }, (node) => {
        node.add('id');
        node.addInlineFragmentOn('Checkout', (Checkout) => {
          Checkout.add('webUrl');
        })
      })
    });

    return this.client.send(query, { checkoutId: _checkoutid }).then(({ model, data }) => {
      return this.client.fetchAllPages(model.checkout, { pageSize: 1 })
    })
  }

  signUp(email, firstName = 'empty', lastName = 'empty', phone = ''): Promise<any> {
    phone = phone == '' ? '+380' + Math.ceil(Math.random() * 1000000000) : phone;
    return this.customerCreate(email, "111111", true, firstName, lastName, phone);
  }

  customerCreate(email, password, acceptsMarketing, firstName, lastName, phone): Promise<any> {
    let query = this.client.mutation((root) => {
      root.add('customerCreate',
        {
          args: {
            input: {
              email: email,
              password: password,
              acceptsMarketing: acceptsMarketing,
              firstName: firstName,
              lastName: lastName,
              phone: phone
            }
          }
        },
        (customerCreate) => {
          customerCreate.add('customer', (customer) => {
            customer.add('id')
          })
        });
    });

    return this.client.send(query, {
      'input': {
        acceptsMarketing: acceptsMarketing,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone
      }
    });
  }
}
