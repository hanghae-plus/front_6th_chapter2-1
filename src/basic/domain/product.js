/* 전체 상품 재고가 이 수치 미만이면, 재고 경고 상태로 간주합니다. */
export const LOW_TOTAL_STOCK_THRESHOLD = 50;

/* 개별 상품 재고가 이 수치 미만이면 '재고 부족'으로 간주합니다. */
export const LOW_STOCK_THRESHOLD = 5;

/* 개별 상품 재고가 이 수치 이하일 경우 '품절' 상태로 간주합니다. */
export const OUT_OF_STOCK = 0;

/* 번개 세일 할인율 */
export const LIGHTNING_DISCOUNT = 0.2;

/* 추천 세일 할인율 */
export const SUGGEST_DISCOUNT = 0.05;

export const PRODUCT_ONE = 'p1';
export const PRODUCT_TWO = 'p2';
export const PRODUCT_THREE = 'p3';
export const PRODUCT_FOUR = 'p4';
export const PRODUCT_FIVE = 'p5';

export const initialProducts = [
  {
    id: PRODUCT_ONE,
    name: '버그 없애는 키보드',
    discountValue: 10000,
    originalValue: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    discountValue: 20000,
    originalVal: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    discountValue: 30000,
    originalVal: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    discountValue: 15000,
    originalVal: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FIVE,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    discountValue: 25000,
    originalVal: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

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
}

const productManager = new ProductsManager();
export default productManager;
