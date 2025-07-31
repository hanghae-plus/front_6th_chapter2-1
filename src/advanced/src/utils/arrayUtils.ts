import type { Product, CartItem } from "../types";

/**
 * ID로 배열에서 아이템 찾기
 */
export const findById = <T extends { id: string }>(
  items: T[],
  id: string
): T | undefined => {
  return items.find((item) => item.id === id);
};

/**
 * 배열 아이템 업데이트
 */
export const updateArrayItem = <T extends { id: string }>(
  items: T[],
  id: string,
  updater: (item: T) => T
): T[] => {
  return items.map((item) => (item.id === id ? updater(item) : item));
};

/**
 * 배열에서 아이템 제거
 */
export const removeArrayItem = <T extends { id: string }>(
  items: T[],
  id: string
): T[] => {
  return items.filter((item) => item.id !== id);
};

/**
 * 배열에 아이템 추가 (중복 체크)
 */
export const addArrayItem = <T extends { id: string }>(
  items: T[],
  newItem: T
): T[] => {
  const existingIndex = items.findIndex((item) => item.id === newItem.id);

  if (existingIndex >= 0) {
    // 기존 아이템이 있으면 업데이트
    return updateArrayItem(items, newItem.id, () => newItem);
  }

  // 새 아이템 추가
  return [...items, newItem];
};

/**
 * 상품 배열에서 상품 찾기
 */
export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => {
  return findById(products, productId);
};

/**
 * 장바구니 아이템 찾기
 */
export const findCartItemById = (
  cart: CartItem[],
  itemId: string
): CartItem | undefined => {
  return findById(cart, itemId);
};

/**
 * 장바구니 아이템 업데이트
 */
export const updateCartItem = (
  cart: CartItem[],
  itemId: string,
  updater: (item: CartItem) => CartItem
): CartItem[] => {
  return updateArrayItem(cart, itemId, updater);
};

/**
 * 상품 재고 업데이트
 */
export const updateProductQuantity = (
  products: Product[],
  productId: string,
  quantityChange: number
): Product[] => {
  return updateArrayItem(products, productId, (product) => ({
    ...product,
    quantity: product.quantity + quantityChange,
  }));
};
