import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Urls } from './urls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SoilService {

  constructor(private _http: HttpClient) {
  }

  getUnites() {
    return Observable.create((observer) => {
      return this._http.get(Urls.unites)
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }

  getExtraction() {
    return Observable.create((observer) => {
      return this._http.get(Urls.extraction)
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }

  getNutrients() {
    return Observable.create((observer) => {
      return this._http.get(Urls.nutrients)
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }

  getCrops(userid, token) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token
    })
    let  headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.crops, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }


  getVarieties(userid, token, cropid) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token,
      "cropId": cropid
    })
    let  headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.varieties, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }

  postLogin() {
    const body = JSON.stringify({
    })
    let  headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.login, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }

  postValidateToken(userid, token) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token
    })
    let  headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.validateToken, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
        err => {
          console.error(err);
        });
    });
  }
}
