import { Product } from './shared/product'

export class SomeProducts {
  public static get() {
    return [
      new Product(42, 1, 4, 'Ur Krostitzer', 'Wahre Helden stehen mitten im Leben.', 0.7, 'JHS09234JKK.jpg', true, new Date('2017-03-01T00:00:00.000Z')),
      new Product(84, 1, 4, 'Augustiner', 'Bayrisches Bier schmeckt fast so gut wie sächsisches Bier', 0.8, '234JKKJHS09.jpg', true, new Date())
    ]
  }
};