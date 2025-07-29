import { POINTS, POINTS_QUANTITY_THRESHOLDS, QUANTITY_BONUS_POINTS } from "../constants/index.js";

// OrderSummary 컴포넌트
export function createOrderSummary({ cartItems, subtotal, totalAmount, itemDiscounts, isTuesday, onCheckout }) {
  const orderSummaryContainer = document.createElement("div");
  orderSummaryContainer.className = "flex-1 flex flex-col";

  // 주문 요약 HTML 구조 생성
  orderSummaryContainer.innerHTML = /* HTML */ `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩${totalAmount ? totalAmount.toLocaleString() : "0"}</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg ${isTuesday && totalAmount > 0 ? "" : "hidden"}">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br />
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  // 체크아웃 버튼 이벤트 리스너 등록
  const checkoutButton = orderSummaryContainer.querySelector("button");
  if (onCheckout) {
    checkoutButton.addEventListener("click", onCheckout);
  }

  // 초기 데이터로 컴포넌트 업데이트
  if (cartItems && cartItems.length > 0) {
    const itemCount = cartItems.reduce((total, item) => {
      const quantity = parseInt(item.querySelector(".quantity-number")?.textContent || "0");
      return total + quantity;
    }, 0);

    updateOrderSummary(orderSummaryContainer, {
      cartItems,
      subtotal: subtotal || 0,
      totalAmount: totalAmount || 0,
      itemDiscounts: itemDiscounts || [],
      isTuesday: isTuesday || false,
      itemCount,
      discountRate: 0,
      savedAmount: 0,
    });
  }

  return orderSummaryContainer;
}

/**
 * 주문 요약 세부 정보를 업데이트합니다.
 *
 * @param {HTMLElement} orderSummaryElement - OrderSummary DOM 요소
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {number} subtotal - 소계
 * @param {number} itemCount - 총 아이템 수량
 * @param {Array} itemDiscounts - 아이템 할인 정보
 * @param {boolean} isTuesday - 화요일 여부
 * @param {Object} options - 추가 옵션
 * @param {number} options.bulkPurchaseThreshold - 대량구매 임계값 (기본값: 30)
 * @param {number} options.bulkDiscountRate - 대량구매 할인율 (기본값: 0.75)
 */
export function updateSummaryDetails(orderSummaryElement, cartItems, subtotal, itemCount, itemDiscounts, isTuesday, options = {}) {
  const { bulkPurchaseThreshold = 30, bulkDiscountRate = 0.75 } = options;

  const summaryDetails = orderSummaryElement.querySelector("#summary-details");
  if (!summaryDetails) return;

  if (subtotal <= 0) {
    summaryDetails.innerHTML = "";
    return;
  }

  // 장바구니 아이템별 상세 정보
  const itemsHTML = cartItems
    .map(item => {
      const quantity = parseInt(item.querySelector(".quantity-number").textContent);
      const productName = item.querySelector("h3").textContent;
      const itemTotal = parseInt(item.querySelector(".text-lg").textContent.replace(/[₩,]/g, ""));

      return `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${productName} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
    })
    .join("");

  // 할인 정보 HTML
  let discountHTML = "";

  if (itemCount >= bulkPurchaseThreshold) {
    discountHTML = `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${bulkPurchaseThreshold}개 이상)</span>
        <span class="text-xs">-${(1 - bulkDiscountRate) * 100}%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    discountHTML = itemDiscounts
      .map(
        item => `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">${item.name} (10개↑)</span>
        <span class="text-xs">-${item.discount}%</span>
      </div>
    `
      )
      .join("");
  }

  // 화요일 할인 정보
  if (isTuesday) {
    discountHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  summaryDetails.innerHTML = /* HTML */ `
    ${itemsHTML}
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
    ${discountHTML}
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

/**
 * 할인 정보를 업데이트합니다.
 *
 * @param {HTMLElement} orderSummaryElement - OrderSummary DOM 요소
 * @param {number} discountRate - 할인율 (0-1)
 * @param {number} savedAmount - 절약 금액
 */
export function updateDiscountInfo(orderSummaryElement, discountRate, savedAmount) {
  const discountInfo = orderSummaryElement.querySelector("#discount-info");
  if (!discountInfo) return;

  if (discountRate > 0 && savedAmount > 0) {
    discountInfo.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else {
    discountInfo.innerHTML = "";
  }
}

/**
 * 총액을 업데이트합니다.
 *
 * @param {HTMLElement} orderSummaryElement - OrderSummary DOM 요소
 * @param {number} totalAmount - 총액
 */
export function updateTotalAmount(orderSummaryElement, totalAmount) {
  const totalDiv = orderSummaryElement.querySelector("#cart-total .text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(totalAmount).toLocaleString();
  }
}

/**
 * 포인트 정보를 계산하고 업데이트합니다.
 *
 * @param {HTMLElement} orderSummaryElement - OrderSummary DOM 요소
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {number} totalAmount - 총액
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} itemCount - 총 아이템 수량
 */
export function updateLoyaltyPoints(orderSummaryElement, cartItems, totalAmount, isTuesday, itemCount) {
  const loyaltyPointsDiv = orderSummaryElement.querySelector("#loyalty-points");
  if (!loyaltyPointsDiv) return;

  const points = calculateLoyaltyPoints(cartItems, totalAmount, isTuesday, itemCount);

  if (points.totalPoints > 0) {
    loyaltyPointsDiv.innerHTML = /* HTML */ `
      <div>적립 포인트: <span class="font-bold">${points.totalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${points.details.join(", ")}</div>
    `;
    loyaltyPointsDiv.style.display = "block";
  } else {
    loyaltyPointsDiv.textContent = "적립 포인트: 0p";
    loyaltyPointsDiv.style.display = "none";
  }
}

/**
 * 포인트를 계산합니다.
 *
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {number} totalAmount - 총액
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} itemCount - 총 아이템 수량
 * @returns {Object} 포인트 정보 { totalPoints, details }
 */
function calculateLoyaltyPoints(cartItems, totalAmount, isTuesday, itemCount) {
  if (cartItems.length === 0) {
    return { totalPoints: 0, details: [] };
  }

  const basePoints = Math.floor(totalAmount / POINTS.BASE_RATE);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * POINTS.TUESDAY_MULTIPLIER;
    pointsDetail.push("화요일 2배");
  }

  // 세트 구매 보너스
  const hasKeyboard = cartItems.some(item => item.id === "p1");
  const hasMouse = cartItems.some(item => item.id === "p2");
  const hasMonitorArm = cartItems.some(item => item.id === "p3");

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS.KEYBOARD_MOUSE_SET;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS.FULL_SET;
    pointsDetail.push("풀세트 구매 +100p");
  }

  // 수량 보너스
  if (itemCount >= POINTS_QUANTITY_THRESHOLDS.LARGE_BULK) {
    finalPoints += QUANTITY_BONUS_POINTS.LARGE_BULK;
    pointsDetail.push("대량구매(30개+) +100p");
  } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.MEDIUM_BULK) {
    finalPoints += QUANTITY_BONUS_POINTS.MEDIUM_BULK;
    pointsDetail.push("대량구매(20개+) +50p");
  } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.SMALL_BULK) {
    finalPoints += QUANTITY_BONUS_POINTS.SMALL_BULK;
    pointsDetail.push("대량구매(10개+) +20p");
  }

  return { totalPoints: finalPoints, details: pointsDetail };
}

/**
 * 화요일 특별 할인 배너를 업데이트합니다.
 *
 * @param {HTMLElement} orderSummaryElement - OrderSummary DOM 요소
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} totalAmount - 총액
 */
export function updateTuesdaySpecial(orderSummaryElement, isTuesday, totalAmount) {
  const tuesdaySpecial = orderSummaryElement.querySelector("#tuesday-special");
  if (!tuesdaySpecial) return;

  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
}

/**
 * OrderSummary의 모든 정보를 한 번에 업데이트합니다.
 *
 * @param {HTMLElement} orderSummaryElement - OrderSummary DOM 요소
 * @param {Object} data - 업데이트할 데이터
 * @param {Array} data.cartItems - 장바구니 아이템들
 * @param {number} data.subtotal - 소계
 * @param {number} data.totalAmount - 총액
 * @param {Array} data.itemDiscounts - 아이템 할인 정보
 * @param {boolean} data.isTuesday - 화요일 여부
 * @param {number} data.itemCount - 총 아이템 수량
 * @param {number} data.discountRate - 할인율
 * @param {number} data.savedAmount - 절약 금액
 */
export function updateOrderSummary(orderSummaryElement, data) {
  const { cartItems, subtotal, totalAmount, itemDiscounts, isTuesday, itemCount, discountRate, savedAmount } = data;

  updateSummaryDetails(orderSummaryElement, cartItems, subtotal, itemCount, itemDiscounts, isTuesday);
  updateDiscountInfo(orderSummaryElement, discountRate, savedAmount);
  updateTotalAmount(orderSummaryElement, totalAmount);
  updateLoyaltyPoints(orderSummaryElement, cartItems, totalAmount, isTuesday, itemCount);
  updateTuesdaySpecial(orderSummaryElement, isTuesday, totalAmount);
}
