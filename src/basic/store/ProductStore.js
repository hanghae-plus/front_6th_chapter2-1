import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
} from '../constants/enum';

const PRODUCT_LIST = [
  {
    id: PRODUCT_ONE,
    name: '버그 없애는 키보드',
    value: 10000,
    originalVal: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    value: 20000,
    originalVal: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    value: 30000,
    originalVal: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    value: 15000,
    originalVal: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FIVE,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    value: 25000,
    originalVal: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

class ProductStore {
  constructor() {
    this.productList = PRODUCT_LIST;
  }

  getProductList() {
    return this.productList;
  }

  getProductById(id) {
    return this.productList.find((product) => product.id === id);
  }

  updateProductQuantity(id, quantity) {
    const product = this.getProductById(id);
    if (product) {
      product.quantity = quantity;
    }
  }
}

export { PRODUCT_LIST };
export default ProductStore;
