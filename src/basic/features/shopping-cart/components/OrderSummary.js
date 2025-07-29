/**
 * Pure render function for Order Summary with local state
 * @param {Object} props - Component properties
 * @param {number} props.totalAmount - Total amount
 * @param {number} props.originalTotal - Original total before discounts
 * @param {number} props.totalItemCount - Total item count
 * @param {number} props.bonusPoints - Bonus points earned
 * @param {Array} props.cartItems - Cart items for calculations
 * @param {Function} props.onUpdate - Callback when summary updates
 * @returns {HTMLElement} Order summary element
 */
function OrderSummary(props = {}) {
  const {
    totalAmount = 0,
    originalTotal = 0,
    totalItemCount = 0,
    bonusPoints = 0,
    cartItems = [],
    onUpdate,
  } = props;

  // Local state (useState-like pattern)
  let internalState = {
    totalAmount,
    originalTotal,
    totalItemCount,
    bonusPoints,
    cartItems: [...cartItems],
  };

  const summaryContainer = document.createElement("div");
  summaryContainer.id = "cart-total";
  summaryContainer.className = "bg-gray-900 text-white p-6 rounded-lg";

  // Local state updaters
  const updateTotals = (newTotals) => {
    internalState = { ...internalState, ...newTotals };
    renderSummary();

    // Notify parent
    if (onUpdate) {
      onUpdate(internalState);
    }
  };

  const updateCartItems = (newCartItems) => {
    internalState.cartItems = [...newCartItems];
    calculateTotals();
  };

  // Local calculations
  const calculateTotals = () => {
    const { cartItems } = internalState;

    let subtotal = 0;
    let itemCount = 0;

    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
      itemCount += item.quantity;
    });

    // Calculate discounts
    let finalTotal = subtotal;
    let discountRate = 0;

    // Apply bulk discount (30+ items = 25% off)
    if (itemCount >= 30) {
      finalTotal = subtotal * 0.75;
      discountRate = 0.25;
    }

    // Apply Tuesday discount (additional 10% off)
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    if (isTuesday && finalTotal > 0) {
      finalTotal = finalTotal * 0.9;
      discountRate = 1 - finalTotal / subtotal;
    }

    // Calculate bonus points (0.1% of final total)
    let points = Math.floor(finalTotal * 0.001);

    // Tuesday bonus (2x points)
    if (isTuesday) {
      points *= 2;
    }

    // Set bonuses for product combinations
    const hasKeyboard = cartItems.some((item) => item.id === "p1");
    const hasMouse = cartItems.some((item) => item.id === "p2");
    const hasMonitorArm = cartItems.some((item) => item.id === "p3");

    if (hasKeyboard && hasMouse) points += 50; // Set bonus
    if (hasKeyboard && hasMouse && hasMonitorArm) points += 100; // Full set bonus

    // Quantity bonuses
    if (itemCount >= 10 && itemCount < 20) points += 20;
    else if (itemCount >= 20 && itemCount < 30) points += 50;
    else if (itemCount >= 30) points += 100;

    // Update internal state
    updateTotals({
      originalTotal: subtotal,
      totalAmount: finalTotal,
      totalItemCount: itemCount,
      bonusPoints: points,
    });
  };

  // Render the summary
  const renderSummary = () => {
    const { totalAmount, originalTotal, totalItemCount, bonusPoints } =
      internalState;
    const discountRate =
      originalTotal > 0
        ? ((originalTotal - totalAmount) / originalTotal) * 100
        : 0;
    const today = new Date();
    const isTuesday = today.getDay() === 2;

    summaryContainer.innerHTML = `
      <h2 class="text-xl font-bold mb-4">주문 요약</h2>
      
      <div class="space-y-3 mb-4">
        <div class="flex justify-between">
          <span>상품 수량</span>
          <span>${totalItemCount}개</span>
        </div>
        
        ${
          originalTotal !== totalAmount
            ? `
          <div class="flex justify-between text-gray-400">
            <span>원래 가격</span>
            <span>₩${originalTotal.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-red-400">
            <span>할인 (${discountRate.toFixed(1)}%)</span>
            <span>-₩${(originalTotal - totalAmount).toLocaleString()}</span>
          </div>
        `
            : ""
        }
        
        <div class="border-t border-gray-700 pt-3">
          <div class="flex justify-between text-xl font-bold">
            <span>총 결제 금액</span>
            <span>₩${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      ${
        bonusPoints > 0
          ? `
        <div class="bg-gray-800 p-3 rounded mb-4">
          <div class="flex justify-between items-center">
            <span class="text-yellow-400">🎁 적립 포인트</span>
            <span class="text-yellow-400 font-bold">${bonusPoints}p</span>
          </div>
          ${
            isTuesday
              ? '<p class="text-xs text-gray-400 mt-1">화요일 2배 적용!</p>'
              : ""
          }
        </div>
      `
          : ""
      }
      
      ${
        isTuesday
          ? `
        <div id="tuesday-special" class="bg-blue-600 p-3 rounded mb-4">
          <p class="text-sm font-medium">🎉 화요일 특별 할인!</p>
          <p class="text-xs">추가 10% 할인 적용됨</p>
        </div>
      `
          : `<div id="tuesday-special" class="hidden"></div>`
      }
      
      <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
        주문하기
      </button>
    `;
  };

  // Initial render
  renderSummary();

  // Expose methods for external updates
  summaryContainer.updateTotals = updateTotals;
  summaryContainer.updateCartItems = updateCartItems;
  summaryContainer.recalculate = calculateTotals;
  summaryContainer.getState = () => ({ ...internalState });

  return summaryContainer;
}

export { OrderSummary };
