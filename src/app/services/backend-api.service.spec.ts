import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BackendApiService } from './backend-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { BackendMethod } from '../models/backend.api.model';

describe('BackendApiService', () => {
  let httpMock: HttpTestingController;
  let service: BackendApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [BackendApiService]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(BackendApiService);
  });
 
  //getCustomerQuery Method

  it(`getCustomerQuery return valid object for shopify API`, () => {
    let result = service['getCustomerQuery']('email', 'firstName', 'lastName', 'phone');
    expect(result.customer.id).toBeGreaterThan(0);
    expect(result.customer.tags).toEqual([environment.brand]); 
    expect(result.customer.accepts_marketing).toEqual(true);
    expect(result.customer.phone).toEqual('phone');
    expect(result.customer.first_name).toEqual('firstName');
    expect(result.customer.last_name).toEqual('lastName');
    expect(result.customer.email).toEqual('email');
  });

  //getProductQuery Method

  it(`getProductQuery return valid object for shopify API`, () => {
    let result = service['getProductQuery']('id', '<div></div>');
    expect(result.product.id).toEqual('id');
    expect(result.product.body_html).toEqual('<div></div>');
  });

  //getCollectionQuery Method

  it(`getCollectionQuery smart_collection return valid object for shopify API`, () => {
    let result = service['getCollectionQuery'](true, 'id', '<div></div>');
    expect(result['smart_collection'].id).toEqual('id');
    expect(result['smart_collection'].body_html).toEqual('<div></div>');
  });

  it(`getCollectionQuery custom_collection return valid object for shopify API`, () => {
    let result = service['getCollectionQuery'](false, 'id', '<div></div>');
    expect(result['custom_collection'].id).toEqual('id');
    expect(result['custom_collection'].body_html).toEqual('<div></div>');
  });

  //getIdFromHash Method

  it(`getIdFromHash return valid id`, () => {
    let result = service['getIdFromHash']('asdasdasd');
    expect(result).toEqual('');
  });

  it(`getIdFromHash return empty string when id not valid`, () => {
    let result = service['getIdFromHash']("Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzgwMzA3Mzg4NTE2");
    expect(result).toEqual('80307388516');
  });

  //subscribeEmail Method

  it(`subscribeEmail make request successfully`, () => {
    service.subscribeEmail('email', 'firstName', 'lastName', 'phone');
    let req = httpMock.expectOne(`${environment.amazon_lambda_gateway}/eep-subscriptions`, 'subscription url');
    expect(req.request.method).toEqual("POST");

    expect(req.request.headers.get('x-api-key')).toEqual(environment.amazon_lambda_token);
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');

    let query = JSON.parse(req.request.body);
    expect(query.method).toEqual(BackendMethod.subscribe);
    expect(query.environment).toEqual(environment.production ? 'prod' : 'dev');

    httpMock.verify();
  });

  it(`subscribeEmail no request without email`, () => {
    service.subscribeEmail('');
    let req = httpMock.expectNone(`${environment.amazon_lambda_gateway}/eep-subscriptions`, 'subscription url');
    httpMock.verify();
  });

  //updateDescription Method

  it(`updateDescription no request without update method`, () => {
    service.updateDescription(null, '', "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzgwMzA3Mzg4NTE2");
    let req = httpMock.expectNone(`${environment.amazon_lambda_gateway}/eep-subscriptions`, 'subscription url');
    httpMock.verify();
  });

  it(`updateDescription no request without valid id`, () => {
    service.updateDescription(BackendMethod.editProduct, '', "asfasfasasfasf");
    let req = httpMock.expectNone(`${environment.amazon_lambda_gateway}/eep-subscriptions`, 'subscription url');
    //service.updateDescription(BackendMethod.editProduct, '', "");
    httpMock.verify();
  });

  it(`updateDescription make request successfully`, () => {
    service.updateDescription(BackendMethod.editProduct, '', "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzgwMzA3Mzg4NTE2");
    let req = httpMock.expectOne(`${environment.amazon_lambda_gateway}/eep-subscriptions`, 'subscription url');
    expect(req.request.method).toEqual("POST");

    expect(req.request.headers.get('x-api-key')).toEqual(environment.amazon_lambda_token);
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');

    let query = JSON.parse(req.request.body);
    expect(query.method).toEqual(BackendMethod.editProduct);
    expect(query.environment).toEqual(environment.production ? 'prod' : 'dev');
    expect(query.elemId).toEqual("80307388516");

    httpMock.verify();
  });

  it(`updateDescription runs getProductQuery when method = editProduct`, () => {
    let spy = spyOn(BackendApiService as any, 'getProductQuery');
    service.updateDescription(BackendMethod.editProduct, '', "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzgwMzA3Mzg4NTE2");
    expect(spy).toHaveBeenCalled();
  });

  it(`updateDescription runs getCollectionQuery when method = editCustomCollection`, () => {
    let spy = spyOn(BackendApiService as any, 'getCollectionQuery');
    service.updateDescription(BackendMethod.editCustomCollection, '', "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzgwMzA3Mzg4NTE2");
    expect(spy).toHaveBeenCalled();
  });

  it(`updateDescription runs getCollectionQuery when method = editSmartCollection`, () => {
    let spy = spyOn(BackendApiService as any, 'getCollectionQuery');
    service.updateDescription(BackendMethod.editSmartCollection, '', "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzgwMzA3Mzg4NTE2");
    expect(spy).toHaveBeenCalled();
  });
});
