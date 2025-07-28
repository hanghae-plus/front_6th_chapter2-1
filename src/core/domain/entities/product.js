import Money from "../vo/Money";
import Quantity from "../vo/quantity";

class Product {
  constructor({ id, name, price, originalVal, quantity, onSale, suggestSale }) {
    this.id = id;
    this.name = name;
    this.price = new Money(price);
    this.originalVal = originalVal;
    this.quantity = new Quantity(quantity);
    this.onSale = onSale;
    this.suggestSale = suggestSale;
  }
}

export default Product;
