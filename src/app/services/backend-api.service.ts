import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BackendMethod } from '../models/backend.api.model';

@Injectable()
export class BackendApiService {
  constructor(private http: HttpClient) { }

  subscribeEmail(email, firstName = "empty", lastName = "empty", phone = ""): Promise<any> {
    if (!email)
      return new Promise((resolve, reject) => reject("Email can't be empty"));
    let query = this.getCustomerQuery(email, firstName, lastName, phone);
    query['method'] = BackendMethod.subscribe;
    query['environment'] = environment.production ? 'prod' : 'dev';
    let queryString = JSON.stringify(query);
    let headers = new HttpHeaders({
      'x-api-key': environment.amazon_lambda_token,
      'Content-Type': 'application/json'
    });
    const formUrl = `${environment.amazon_lambda_gateway}/eep-subscriptions`;
    return this.http.post(formUrl, queryString, { headers: headers }).toPromise();
  }

  updateDescription(method, body, id): Promise<any> {
    let decodedId = this.getIdFromHash(id);
    if (!method || !decodedId)
      return new Promise((resolve, reject) => reject("Id and Update method can't be empty"));
    let query = method == BackendMethod.editProduct ? this.getProductQuery(decodedId, body) : this.getCollectionQuery(method == BackendMethod.editSmartCollection, decodedId, body);
    query['method'] = method;
    query['environment'] = environment.production ? 'prod' : 'dev';
    query['elemId'] = decodedId;
    let queryString = JSON.stringify(query);
    let headers = new HttpHeaders({
      'x-api-key': environment.amazon_lambda_token,
      'Content-Type': 'application/json'
    });
    const formUrl = `${environment.amazon_lambda_gateway}/eep-subscriptions`;
    return this.http.post(formUrl, queryString, { headers: headers }).toPromise();
  }

  sendEmail(to, message, subject): Promise<any> {
    let query = {
      to: to,
      message: message,
      subject: subject,
      method: 'sendEmail',
      environment: environment.production ? 'prod' : 'dev'
    };
    let queryString = JSON.stringify(query);
    let headers = new HttpHeaders({
      'x-api-key': environment.amazon_lambda_token,
      'Content-Type': 'application/json'
    });
    const formUrl = `${environment.amazon_lambda_gateway}/eep-subscriptions`;
    return this.http.post(formUrl, queryString, { headers: headers }).toPromise();
  }

  getCustomerQuery(email, firstName, lastName, phone) {
    return {
      "customer": {
        "id": Math.ceil(Math.random() * 999999999),
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "phone": phone,
        "accepts_marketing": true,
        "tags": [environment.brand]
      }
    };
  }

  getProductQuery(id, bodyHtml) {
    return {
      "product": {
        "id": id,
        "body_html": bodyHtml
      }
    };
  }

  getCollectionQuery(isSmartCollection, id, bodyHtml) {
    let collectionType = isSmartCollection ? "smart_collection" : "custom_collection";
    let obj = {};
    obj[collectionType] = {
      "id": id,
      "body_html": bodyHtml
    }
    return obj;
  }

  getIdFromHash(id){
    try{
      let idArray = atob(id).split('/');
      return idArray[idArray.length - 1];
    } catch {
      return '';
    }
  }
}