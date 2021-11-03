import { ProductTO } from "@/services/product/types/ProductTO";
import Payment from "./Payment";

export default class Product implements ProductTO {
  id?: number;
  imageUrl?: string;
  productName?: string;
  productDescription?: string;
  creatorId?: number;
  groupId?: number;
  groupName?: string;
  price?: number;
  payments?: Payment[]=[];

  constructor() {}

  static fromTO(template: ProductTO): Product {
    let product = new Product();
    Object.assign(product, template);
    product.payments = Payment.fromTOList(template.payments);
    return product;
  }

  static fromTOList(template?: ProductTO[]): Product[] {
    if (template != undefined) {
      return template.map(it => Product.fromTO(it));
    }
    return [];
  }
}
