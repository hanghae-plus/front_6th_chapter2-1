import { DOM_IDS } from "../shared/constants";
import { CSS_SELECTORS } from "../shared/constants";

export function OrderSummary() {
  const orderSummary = document.createElement("div");
  orderSummary.className = "bg-black text-white p-8 flex flex-col";
  orderSummary.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
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
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  return orderSummary;
}

export function updateSummaryDetails({
  summaryDetails,
  cartItems,
  products,
  subTotalPrice,
  itemCount,
  itemDiscounts,
  isTuesday,
  totalAmt,
}) {
  summaryDetails.innerHTML = "";

  if (subTotalPrice > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(CSS_SELECTORS.QUANTITY_NUMBER);
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = curItem.price * quantity;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotalPrice.toLocaleString()}</span>
      </div>
    `;

    if (itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday && totalAmt > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

export function updateCartTotal({ totalPriceElement, totalAmt }) {
  if (totalPriceElement) {
    totalPriceElement.textContent = "₩" + Math.round(totalAmt).toLocaleString();
  }
}

export function updateLoyaltyPoints({ totalAmt }) {
  const loyaltyPointsDiv = document.getElementById("loyalty-points");
  const points = Math.floor(totalAmt / 1000);
  if (loyaltyPointsDiv) {
    if (points > 0) {
      loyaltyPointsDiv.textContent = "적립 포인트: " + points + "p";
      loyaltyPointsDiv.style.display = "block";
    } else {
      loyaltyPointsDiv.textContent = "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }
}

export function updateDiscountInfo({ discRate, originalTotal, totalAmt }) {
  const discountInfoDiv = document.getElementById(DOM_IDS.DISCOUNT_INFO);
  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(
            discRate * 100
          ).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else {
    discountInfoDiv.innerHTML = "";
  }
}

export function updateTuesdaySpecial({ isTuesday, totalAmt }) {
  const tuesdaySpecialDiv = document.getElementById(DOM_IDS.TUESDAY_SPECIAL);
  if (isTuesday && totalAmt > 0) {
    tuesdaySpecialDiv.classList.remove("hidden");
  } else {
    tuesdaySpecialDiv.classList.add("hidden");
  }
}

export function updateBonusPointsDisplay({ bonusPts, pointsResult }) {
  const ptsTag = document.getElementById("loyalty-points");

  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
        "p</span></div>" +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsResult.pointsDetails.join(", ") +
        "</div>";
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
}
