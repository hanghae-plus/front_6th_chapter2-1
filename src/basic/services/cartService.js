// src/services/cartService.js
import { getProductById, updateProductQuantity } from './productService';

let cartItems = []; // 장바구니 아이템 배열: { id, quantity }

export const getCartItems = () => [...cartItems]; // 장바구니 모든 아이템 반환 (복사본)
export const addItemToCart = () => {
  const productId = document.getElementById('product-select').value; // 선택된 상품 ID 가져오기
  const product = getProductById(productId);

  if (!product || product.q <= 0) {
    return { success: false, message: '재고가 부족합니다.' };
  }

  const existingItemIndex = cartItems.findIndex((item) => item.id === productId);
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity++; // 수량 증가
  } else {
    cartItems.push({ id: productId, quantity: 1 }); // 새 상품 추가
  }
  updateProductQuantity(productId, -1); // 상품 재고 감소
  return { success: true, message: '상품이 장바구니에 추가되었습니다.' };
};

export const updateCartItemQuantity = (productId, change) => {
  const existingItemIndex = cartItems.findIndex((item) => item.id === productId);
  if (existingItemIndex === -1) {
    return { success: false, message: '장바구니에 없는 상품입니다.' };
  }

  const currentQty = cartItems[existingItemIndex].quantity;
  const newQty = currentQty + change;
  const product = getProductById(productId);

  if (!product) {
    return { success: false, message: '상품 정보를 찾을 수 없습니다.' };
  }

  if (newQty > 0 && product.q + currentQty >= newQty) {
    cartItems[existingItemIndex].quantity = newQty;
    updateProductQuantity(productId, -change); // 상품 재고 조정
    return { success: true, message: '수량이 업데이트되었습니다.' };
  } else if (newQty <= 0) {
    removeItemFromCart(productId); // 수량 0 이하면 제거
    return { success: true, message: '상품이 장바구니에서 제거되었습니다.' };
  } else {
    return { success: false, message: '재고가 부족합니다.' };
  }
};

export const removeItemFromCart = (productId) => {
  const existingItemIndex = cartItems.findIndex((item) => item.id === productId);
  if (existingItemIndex === -1) {
    return { success: false, message: '장바구니에 없는 상품입니다.' };
  }

  const quantityToRemove = cartItems[existingItemIndex].quantity;
  cartItems.splice(existingItemIndex, 1); // 장바구니에서 제거
  updateProductQuantity(productId, quantityToRemove); // 재고 원복
  return { success: true, message: '상품이 장바구니에서 제거되었습니다.' };
};

export const getTotalCartQuantity = () => cartItems.reduce((sum, item) => sum + item.quantity, 0); // 총 상품 수량 계산

export const clearCart = () => {
  cartItems = []; // 장바구니 초기화
};
