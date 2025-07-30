import { QUANTITY_THRESHOLDS, DISCOUNT_RATES } from "../constants/index.js";

// 장바구니 아이템 데이터를 추출합니다.
function extractCartItemData(cartItem) {
  const quantity = parseInt(cartItem.querySelector(".quantity-number").textContent);
  const productName = cartItem.querySelector("h3").textContent;
  const itemTotal = parseInt(cartItem.querySelector(".text-lg").textContent.replace(/[₩,]/g, ""));

  return { quantity, productName, itemTotal };
}

// 장바구니 아이템 HTML을 생성합니다.
function createCartItemRow(productName, quantity, itemTotal) {
  return `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${productName} x ${quantity}</span>
      <span>₩${itemTotal.toLocaleString()}</span>
    </div>
  `;
}

// 장바구니 아이템들 HTML을 생성합니다.
function createCartItemsHTML(cartItems) {
  return cartItems
    .map(item => {
      const { quantity, productName, itemTotal } = extractCartItemData(item);
      return createCartItemRow(productName, quantity, itemTotal);
    })
    .join("");
}

// 할인 정보 HTML을 생성합니다.
function createDiscountHTML(itemCount, itemDiscounts, isTuesday, bulkPurchaseThreshold, bulkDiscountRate) {
  let discountHTML = "";

  if (itemCount >= bulkPurchaseThreshold) {
    discountHTML = `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매!!! 할인 (${bulkPurchaseThreshold}개 이상)</span>
        <span class="text-xs">-${(1 - bulkDiscountRate) * 100}%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    discountHTML = itemDiscounts
      .map(
        item => `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">${item.name} (${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑)</span>
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

  return discountHTML;
}

// 주문 요약 HTML을 생성합니다.
function createSummaryHTML(itemsHTML, subtotal, discountHTML) {
  return /* HTML */ `
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

// OrderSummary 컴포넌트
export function createOrderSummary() {
  const orderSummaryContainer = document.createElement("div");
  orderSummaryContainer.id = "order-summary";
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
            <div id="total-amount" class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right" style="display: none;">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
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

  return orderSummaryContainer;
}

// 주문 요약 세부 정보를 업데이트합니다.
export function updateSummaryDetails(cartItems, subtotal, itemCount, itemDiscounts, isTuesday, options = {}) {
  const { bulkPurchaseThreshold = QUANTITY_THRESHOLDS.BULK_PURCHASE, bulkDiscountRate = DISCOUNT_RATES.BULK_PURCHASE } = options;

  const summaryDetails = document.querySelector("#summary-details");
  if (!summaryDetails) return;

  if (subtotal <= 0) {
    summaryDetails.innerHTML = "";
    return;
  }

  const itemsHTML = createCartItemsHTML(cartItems);
  const discountHTML = createDiscountHTML(itemCount, itemDiscounts, isTuesday, bulkPurchaseThreshold, bulkDiscountRate);
  const summaryHTML = createSummaryHTML(itemsHTML, subtotal, discountHTML);

  summaryDetails.innerHTML = summaryHTML;
}

// 할인 정보를 업데이트합니다.
function updateDiscountInfo(discountRate, savedAmount) {
  const discountInfo = document.querySelector("#discount-info");
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

// 총액을 업데이트합니다.
function updateTotalAmount(totalAmount) {
  const totalDiv = document.querySelector("#total-amount");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(totalAmount).toLocaleString();
  }
}

// 포인트를 표시합니다.
function updateLoyaltyPoints(totalPoints, pointsDetails) {
  const loyaltyPointsDiv = document.querySelector("#loyalty-points");
  if (!loyaltyPointsDiv) return;

  if (totalPoints > 0) {
    loyaltyPointsDiv.innerHTML = /* HTML */ `
      <div>적립 포인트: <span class="font-bold">${totalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetails.join(", ")}</div>
    `;
    loyaltyPointsDiv.style.display = "block";
  } else {
    loyaltyPointsDiv.textContent = "적립 포인트: 0p";
    loyaltyPointsDiv.style.display = "none";
  }
}

function updateTuesdaySpecial(isTuesday, totalAmount) {
  const tuesdaySpecial = document.querySelector("#tuesday-special");
  if (!tuesdaySpecial) return;

  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
}

// OrderSummary의 모든 정보를 한 번에 업데이트합니다.
export function updateOrderSummary(orderState) {
  const { cartItems = [], subtotal, totalAmount, discountRate, savedAmount, itemCount, itemDiscounts, isTuesday, totalPoints, pointsDetails } = orderState;
  console.log("===orderState===");
  console.log(orderState);
  console.log("===orderState===");

  updateSummaryDetails(cartItems, subtotal, itemCount, itemDiscounts, isTuesday);
  updateDiscountInfo(discountRate, savedAmount);
  updateTotalAmount(totalAmount);
  updateLoyaltyPoints(totalPoints, pointsDetails);
  updateTuesdaySpecial(isTuesday, totalAmount);
}
