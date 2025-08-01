// services/cart.ts
import { Product } from '../types/index.js';

// React용 장바구니 로직들 (순수 함수로 만듦)
export function canAddToCart(product: Product): boolean {
  return product && product.stock > 0;
}

export function canChangeQuantity(product: Product, change: number): boolean {
  if (change > 0) {
    return product.stock > 0;
  }
  return true; // 감소는 항상 가능
}

export function updateProductStock(
  products: Product[], 
  productId: string, 
  stockChange: number
): Product[] {
  return products.map(p => 
    p.id === productId 
      ? { ...p, stock: p.stock + stockChange }
      : p
  );
}

export function updateCartQuantity(
  cartItems: Record<string, number>,
  productId: string,
  newQuantity: number
): Record<string, number> {
  if (newQuantity <= 0) {
    const newItems = { ...cartItems };
    delete newItems[productId];
    return newItems;
  }
  
  return {
    ...cartItems,
    [productId]: newQuantity
  };
}