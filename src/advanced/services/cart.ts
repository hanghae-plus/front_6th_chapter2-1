// services/cart.ts
import {
  getProduct,
  getCartQuantity,
  setCartQuantity,
  setLastSelectedProductId,
  updateProduct,
} from '../store/state.js';
import { updateCart } from './discount.js';

export function addToCart(productId: string): void {
  const product = getProduct(productId);
  if (!product || product.stock === 0) {
    alert('재고가 부족합니다.');
    return;
  }

  const currentQuantity = getCartQuantity(productId);
  
  setCartQuantity(productId, currentQuantity + 1);
  updateProduct(productId, { stock: product.stock - 1 });
  setLastSelectedProductId(productId);
  
  updateCart();
}

export function changeQuantity(productId: string, change: number): void {
  const product = getProduct(productId);
  if (!product) return;
  
  const currentQty = getCartQuantity(productId);
  const newQty = currentQty + change;

  if (newQty > 0) {
    if (change > 0 && product.stock === 0) {
      alert('재고가 부족합니다.');
      return;
    }

    setCartQuantity(productId, newQty);
    updateProduct(productId, { stock: product.stock - change });
  } else {
    // 수량이 0이 되면 제거
    removeFromCart(productId);
    return;
  }

  updateCart();
}

export function removeFromCart(productId: string): void {
  const product = getProduct(productId);
  if (!product) return;
  
  const quantity = getCartQuantity(productId);

  updateProduct(productId, { stock: product.stock + quantity });
  setCartQuantity(productId, 0);

  updateCart();
}