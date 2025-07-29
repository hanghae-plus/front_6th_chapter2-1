/**
 * 전체 상품 재고가 이 수치 미만이면, 재고 경고 상태로 간주합니다.
 */
export const LOW_TOTAL_STOCK_THRESHOLD = 50;

/**
 * 개별 상품 재고가 이 수치 미만이면 '재고 부족'으로 간주합니다.
 */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * 개별 상품 재고가 이 수치 이하일 경우 '품절' 상태로 간주합니다.
 */
export const OUT_OF_STOCK = 0;

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

  getProducts() {
    return this.#productList;
  }

  getProductCount() {
    return this.#productList.length;
  }

  getProductAt(index) {
    if (index < 0 || index >= this.#productList.length) {
      throw new RangeError(`index ${index} is out of bounds (0 ~ ${this.#productList.length - 1})`);
    }

    return this.#productList[index];
  }

  getTotalStock() {
    if (!this.#productList) throw Error();

    return this.#productList.reduce((totalStock, currentProduct) => totalStock + currentProduct.q, 0);
  }

  getLowStockMessages() {
    return this.#productList
      .filter((product) => product.q < LOW_STOCK_THRESHOLD)
      .map((product) =>
        product.q > OUT_OF_STOCK ? `${product.name}: 재고 부족 (${product.q}개 남음)` : `${product.name}: 품절`
      )
      .join('\n');
  }
}

const productManager = new ProductsManager();
export default productManager;
