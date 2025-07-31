/**
 * 상품 타입
 *
 * @description 상품 정보를 담는 타입
 * @property {string} id - 상품 ID
 * @property {string} name - 상품 이름
 * @property {number} val - 상품 가격
 * @property {number} originalVal - 상품 원래 가격
 * @property {number} q - 상품 수량
 * @property {boolean} onSale - 상품 판매 여부
 * @property {boolean} suggestSale - 상품 추천 판매 여부
 */
export interface ProductData {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  onSale: boolean;
  suggestSale: boolean;
  discountRate: number;
}

export enum ProductStatus {
  OUT_OF_STOCK = 'outOfStock',
  SUPER_SALE = 'superSale',
  LIGHTNING_SALE = 'lightningSale',
  SUGGESTION_SALE = 'suggestionSale',
  NORMAL = 'normal',
}
