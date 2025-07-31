import { PRODUCT_ID, DISCOUNT, STOCK, TIMER, POINTS } from './constants.js';
import { state } from './state.js';
import {
  createInitialDOM,
  updateItemCount,
  updateCartSummary,
  updateDiscountInfo,
  updateLoyaltyPoints,
  updateStockStatus,
  updateTuesdaySpecial,
  renderCart,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
} from './view.js';
import { setupEventListeners } from './events.js';
import { startTimers } from './services.js';
import {
  calculateSubtotal,
  calculateDiscounts,
  calculateTotal,
  calculatePoints,
} from './calculator.js';

function handleCalculateCartStuff() {
  const cartItems = state.cart.map((item) => ({
    id: item.productId,
    quantity: item.quantity,
  }));

  const subtotal = calculateSubtotal(cartItems, state.products);
  const discounts = calculateDiscounts(cartItems, state.products);
  const totalAmount = calculateTotal(
    subtotal,
    discounts.totalDiscount,
    discounts.bulkDiscountRate
  );
  const points = calculatePoints(cartItems, totalAmount, state.products);

  state.totalAmount = totalAmount;
  state.itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  state.bonusPoints = points.finalPoints;

  updateItemCount(state.itemCount);
  updateCartSummary({
    cart: cartItems,
    products: state.products,
    subtotal,
    totalAmount,
    discounts,
  });
  updateDiscountInfo(subtotal, totalAmount);
  updateTuesdaySpecial(totalAmount);
  updateStockStatus(state.products);
  updateLoyaltyPoints(points);
}

// 애플리케이션의 메인 진입점
function main() {
  const dom = createInitialDOM();
  const {
    productSelect,
    addToCartButton,
    cartItemsContainer,
    helpButton,
    helpOverlay,
    helpColumn,
  } = dom;

  // 도움말 UI 이벤트 핸들러
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

  // 초기 렌더링 및 계산
  renderCart(cartItemsContainer, state.cart, state.products);
  onUpdateSelectOptions(productSelect, state.products);
  handleCalculateCartStuff();

  // 이벤트 리스너 설정
  setupEventListeners({
    addBtn: addToCartButton,
    cartDisp: cartItemsContainer,
    productSelect: productSelect,
    onUpdateSelectOptions: () =>
      onUpdateSelectOptions(productSelect, state.products),
    handleCalculateCartStuff: () => handleCalculateCartStuff(),
  });

  // 비동기 서비스 시작
  startTimers({
    onUpdateSelectOptions: () =>
      onUpdateSelectOptions(productSelect, state.products),
    doUpdatePricesInCart: () =>
      doUpdatePricesInCart(
        cartItemsContainer,
        state.products,
        handleCalculateCartStuff
      ),
    cartDisp: cartItemsContainer,
  });
}

// 앱 실행
main();