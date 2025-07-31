import { stateManager } from './state.js';
import {
  createInitialDOM,
  onUpdateSelectOptions,
  renderCart, // renderCart import 추가
  updateCartSummary,
  updateDiscountInfo,
  updateLoyaltyPoints,
  updateItemCount,
  updateStockStatus,
  updateTuesdaySpecial,
} from './view.js';
import {
  calculateSubtotal,
  calculateDiscounts,
  calculateTotal,
  calculatePoints,
} from './calculator.js';
import { setupEventListeners } from './events.js';
import { startTimers } from './services.js';

function main() {
  stateManager.reset(); // 상태 초기화
  const dom = createInitialDOM();
  const {
    productSelect,
    addToCartButton,
    cartItemsContainer,
    helpButton,
    helpOverlay,
    helpColumn,
  } = dom;

  const render = () => {
    const currentState = stateManager.getState();
    const { cart, products } = currentState;
    const today = new Date();

    // DOM에서 현재 카트 상태를 읽어오는 대신 state 객체를 사용
    const subtotal = calculateSubtotal(cart, products);
    const discounts = calculateDiscounts(cart, products);
    const totalAmount = calculateTotal(
      subtotal,
      discounts.totalDiscount,
      discounts.bulkDiscountRate,
      today
    );
    const points = calculatePoints(cart, totalAmount, products, today);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    updateItemCount(totalQuantity);
    updateCartSummary({
      cart,
      products,
      subtotal,
      totalAmount,
      discounts,
    });
    updateDiscountInfo(subtotal, totalAmount);
    updateTuesdaySpecial(totalAmount, today);
    updateStockStatus(products);
    updateLoyaltyPoints(points);

    // 장바구니 아이템 목록 렌더링 추가
    renderCart(cartItemsContainer, cart, products);
  };

  // Initial Render
  onUpdateSelectOptions(productSelect, stateManager.getState().products);
  render();

  // Subscribe to state changes
  stateManager.subscribe(render);

  // Setup Event Listeners
  helpButton.onclick = () => {
    helpOverlay.classList.toggle('hidden');
    helpColumn.classList.toggle('translate-x-full');
  };
  helpOverlay.onclick = (e) => {
    if (e.target === helpOverlay) {
      helpOverlay.classList.add('hidden');
      helpColumn.classList.add('translate-x-full');
    }
  };
  helpColumn.querySelector('button').onclick = () => {
    helpOverlay.classList.add('hidden');
    helpColumn.classList.add('translate-x-full');
  };

  setupEventListeners({
    addBtn: addToCartButton,
    cartDisp: cartItemsContainer,
    productSelect: productSelect,
  });

  // Start Timers
  startTimers({
    cartDisp: cartItemsContainer,
    productSelect: productSelect,
  });
}

main();
