// 상품 도메인 타입
export interface ProductId {
  readonly value: string;
}

export interface Money {
  readonly amount: number;
  readonly currency: 'KRW';
}

export interface ProductStock {
  readonly quantity: number;
  readonly isAvailable: boolean;
}

export interface ProductDiscount {
  readonly isOnSale: boolean;
  readonly isSuggested: boolean;
  readonly discountRate?: number;
}

export interface Product {
  readonly id: ProductId;
  readonly name: string;
  readonly price: Money;
  readonly originalPrice: Money;
  readonly stock: ProductStock;
  readonly discount: ProductDiscount;
}

export const createProductId = (value: string): ProductId => ({ value });
export const createMoney = (amount: number): Money => ({
  amount,
  currency: 'KRW',
});
export const createStock = (quantity: number): ProductStock => ({
  quantity,
  isAvailable: quantity > 0,
});
