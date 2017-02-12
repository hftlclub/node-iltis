import { Product } from './product';

export class ProductFactory {

  static empty(): Product {
    return new Product(0, 0, 0, '', '', 0, '', true, false, new Date());
  }

  static fromJson(json: any): Product {

    let product = ProductFactory.empty();

    if (this.validNumber(json.id)) {
      product.id = json.id;
    }

    if (this.validNumber(json.refCategory)) {
      product.refCategory = json.refCategory;
    }

    if (this.validNumber(json.refUnit)) {
      product.refUnit = json.refUnit;
    }

    if (this.validString(json.name)) {
      product.name = json.name.trim();
    }

    if (this.validString(json.description)) {
      product.description = json.description.trim();
    }

    if (this.validNumber(json.priceIntern)) {
      product.priceIntern = json.priceIntern;
    }

    if (this.validString(json.imgFilename)) {
      product.imgFilename = json.imgFilename.trim();
    }

    if (this.validNumber(json.active)) {
      product.active = !!json.active;
    }

    if (this.validNumber(json.deleted)) {
      product.deleted = !!json.deleted;
    }

    if (json.timestamp) {
      if(this.validDate(json.timestamp)) {
        product.timestamp = json.timestamp;
      } else {
        product.timestamp = new Date(json.timestamp);
      }
    }

    return product;
  }

  private static validNumber(no: string) {
    return no && typeof no == 'number';
  }

  private static validString(str: string) {
    return str && typeof str == 'string';
  }

  private static validDate(date: string) {
    return (new Date(date)).toString() !== 'Invalid Date';
  }
  
}
