import {environment} from '../../../environments/environment';


export class Urls {
  static base = environment.apiUrl;

  static unites = Urls.base + 'unites/';
  static extraction = Urls.base + 'extraction/';
  static nutrients = Urls.base + 'nutrients/';
  static login = Urls.base + 'login/';
  static validateToken = Urls.base + 'validatetoken/';
  static crops = Urls.base + 'crops/';
  static varieties = Urls.base + 'varieties/';
}
