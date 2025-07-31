import { LOW_STOCK_THRESHOLD, LOW_TOTAL_STOCK_THRESHOLD, OUT_OF_STOCK } from '../const/stock';

class ProductsManager {
  static #instance;
  #productList = [];

  constructor() {
    if (ProductsManager.#instance) {
      return ProductsManager.#instance;
    }
    ProductsManager.#instance = this;
  }

  setProducts(products) {
    this.#productList = products;
  }

  changeQuantity(productId, delta) {
    const product = this.#productList.find((p) => p.id === productId);
    if (!product) {
      throw new Error(`Product with id "${productId}" not found`);
    }

    const newQuantity = product.quantity + delta;
    if (newQuantity >= 0) {
      product.quantity = newQuantity;
    }
  }

  getProducts() {
    return this.#productList;
  }

  getProductCount() {
    return this.#productList.length;
  }

  getProductById(id) {
    const targetProduct = this.#productList.find((product) => product.id === id);

    if (!targetProduct) throw Error('해당하는 상품이 없습니다.');

    return targetProduct;
  }

  getProductAt(index) {
    if (index < 0 || index >= this.#productList.length) {
      throw new RangeError(`index ${index} is out of bounds (0 ~ ${this.#productList.length - 1})`);
    }

    return this.#productList[index];
  }

  getTotalStock() {
    if (!this.#productList) throw Error();

    return this.#productList.reduce((totalStock, currentProduct) => totalStock + currentProduct.quantity, 0);
  }

  isLowTotalStock() {
    return this.getTotalStock() < LOW_TOTAL_STOCK_THRESHOLD;
  }

  getLowStockMessages() {
    return this.#productList
      .filter((product) => product.quantity < LOW_STOCK_THRESHOLD)
      .map((product) =>
        product.quantity > OUT_OF_STOCK
          ? `${product.name}: 재고 부족 (${product.quantity}개 남음)`
          : `${product.name}: 품절`
      )
      .join('\n');
  }

  getLowStockProducts() {
    return this.#productList.filter(
      (product) => OUT_OF_STOCK < product.quantity && product.quantity < LOW_STOCK_THRESHOLD
    );
  }

  getOptionMessage(product) {
    const baseText = `${product.name} - ${product.discountValue}원`;

    if (product.quantity === OUT_OF_STOCK) {
      const suffix = product.onSale ? ' ⚡SALE' : product.suggestSale ? ' 💝추천' : '';
      return `${baseText} (품절)${suffix}`;
    }

    if (product.onSale && product.suggestSale) {
      return `⚡💝 ${baseText} (25% SUPER SALE!)`;
    }

    if (product.onSale) {
      return `⚡ ${product.name} - ${product.originalVal}원 → ${product.discountValue}원 (20% SALE!)`;
    }

    if (product.suggestSale) {
      return `💝 ${product.name} - ${product.originalVal}원 → ${product.discountValue}원 (5% 추천할인!)`;
    }

    return baseText;
  }

  getProductOptions() {
    return this.#productList.map((product) => ({
      id: product.id,
      message: this.getOptionMessage(product),
      disabled: product.quantity === OUT_OF_STOCK,
    }));
  }
}
const productManager = new ProductsManager();
export default productManager;
