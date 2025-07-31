import { state } from './state.js';
import {
  createInitialDOM,
  onUpdateSelectOptions,
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
  const dom = createInitialDOM();
  const {
    productSelect,
    addToCartButton,
    cartItemsContainer,
    helpButton,
    helpOverlay,
    helpColumn,
  } = dom;

  const handleCalculateCartStuff = () => {
    const cartItems = Array.from(cartItemsContainer.children).map((item) => {
      const id = item.id;
      const quantity = parseInt(
        item.querySelector('.quantity-number').textContent
      );
      return { id, quantity };
    });

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
  };

  // Initial Render
  onUpdateSelectOptions(productSelect, state.products);
  handleCalculateCartStuff();

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
    handleCalculateCartStuff: handleCalculateCartStuff,
  });

  // Start Timers
  startTimers({
    cartDisp: cartItemsContainer,
    productSelect: productSelect,
    handleCalculateCartStuff: handleCalculateCartStuff,
  });
}

main();
