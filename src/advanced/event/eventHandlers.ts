// event/eventHandlers.ts
import { getElements } from '../store/state.js';
import { addToCart, changeQuantity, removeFromCart } from '../services/cart.js';

// 이벤트 핸들러 설정
export function setupEventHandlers(): void {
  const elements = getElements();

  // 상품 추가 버튼
  elements.addButton.addEventListener('click', function () {
    const selectedProductId = elements.productSelect.value;
    if (selectedProductId) {
      addToCart(selectedProductId);
    }
  });

  // 장바구니 클릭 이벤트 (이벤트 위임)
  elements.cartItems.addEventListener('click', function (event) {
    const target = event.target as HTMLElement;

    if (target.classList.contains('quantity-change')) {
      const productId = target.dataset.productId!;
      const change = parseInt(target.dataset.change!);
      changeQuantity(productId, change);
    } else if (target.classList.contains('remove-item')) {
      const productId = target.dataset.productId!;
      removeFromCart(productId);
    }
  });
}