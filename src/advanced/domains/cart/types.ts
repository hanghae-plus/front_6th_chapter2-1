import { Product, ProductId, Money } from '../product/types';

// 장바구니 도메인 타입
export interface CartItemId {
  readonly value: string;
}

export interface CartItemQuantity {
  readonly value: number;
}

export interface CartItem {
  readonly id: CartItemId;
  readonly product: Product;
  readonly quantity: CartItemQuantity;
  readonly subtotal: Money;
}

export interface Cart {
  readonly items: readonly CartItem[];
  readonly totalItems: number;
  readonly subtotal: Money;
}

export interface CartOperationResult<T = void> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

// Value Objects 생성 함수
export const createCartItemId = (value: string): CartItemId => ({ value });

export const createCartItemQuantity = (value: number): CartItemQuantity => {
  if (value <= 0) {
    throw new Error('Cart item quantity must be positive');
  }
  return { value };
};

export const createCartItem = (
  product: Product,
  quantity: CartItemQuantity
): CartItem => {
  const subtotal = {
    amount: product.price.amount * quantity.value,
    currency: product.price.currency,
  } as const;

  return {
    id: createCartItemId(`${product.id.value}-${Date.now()}`),
    product,
    quantity,
    subtotal,
  };
};

export const createEmptyCart = (): Cart => ({
  items: [],
  totalItems: 0,
  subtotal: { amount: 0, currency: 'KRW' },
});
