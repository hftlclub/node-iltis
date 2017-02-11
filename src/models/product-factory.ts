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
      if(json.active == 0) product.active = false;
      else product.active = true;
    } else if (this.validBoolean(json.active)) {
      product.active = json.active;
    }

    if (this.validNumber(json.deleted)) {
      if(json.deleted == 0) product.deleted = false;
      else product.deleted = true;
    } else if (this.validBoolean(json.deleted)) {
      product.deleted = json.deleted;
    }

    if (this.validString(json.timestamp) &&
        this.validDate(json.published)) {
      product.timestamp = new Date(json.timestamp);
    }

    return product;
  }

  private static validNumber(no: string) {
    return no && typeof no == 'number';
  }

  private static validBoolean(bo: string) {
    return bo && typeof bo == 'boolean';
  }

  private static validString(str: string) {
    return str && typeof str == 'string';
  }

  private static validDate(date: string) {
    return (new Date(date)).toString() != 'Invalid Date';
  }
  
}
