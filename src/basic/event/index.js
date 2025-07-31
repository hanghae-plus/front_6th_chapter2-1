import { handleAddToCart, handleCartItemActions } from './Cart.js';
import { startAutomaticEvents } from './Auto.js';
import { setupManualEventListeners } from './Manual.js';

// 모든 이벤트 리스너 설정
export const setupAllEventListeners = () => {
  setupCartEvents();
  setupManualEventListeners();
  startAutomaticEvents();
};

// 장바구니 관련 이벤트 설정
const setupCartEvents = () => {
  // ADD TO CART 버튼 이벤트
  const addToCartButton = document.getElementById('add-to-cart');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', handleAddToCart);
  }

  // 장바구니 아이템 액션 이벤트 (이벤트 위임)
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', handleCartItemActions);
  }
}; 