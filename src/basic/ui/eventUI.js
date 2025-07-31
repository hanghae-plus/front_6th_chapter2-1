/**
 * 이벤트 관련 UI 업데이트 함수들
 * 원본 main.original.js의 UI 업데이트 로직을 100% 유지
 */
import { $ } from "../utils/$.js";
import { calculateBonusPoints } from "../utils/businessLogic.js";
import {
  setElementAttributes,
  setElementHTML,
  setElementText,
  setElementVisibility,
} from "./uiHelpers.js";

/**
 * 화요일 특별 할인 표시 업데이트 - 원본과 동일
 * @param {boolean} isTuesday - 화요일 여부
 */
export function updateTuesdaySpecialDisplay(isTuesday) {
  const tuesdaySpecial = $("#tuesday-special");
  if (!tuesdaySpecial) return;

  if (isTuesday) {
    setElementAttributes(tuesdaySpecial, {
      className: tuesdaySpecial.className.replace("hidden", "").trim(),
    });
  } else {
    setElementAttributes(tuesdaySpecial, { className: tuesdaySpecial.className + " hidden" });
  }
}

/**
 * 주문 요약 업데이트 - 원본과 동일
 * @param {Object} calculationResult - 계산 결과
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 */
export function updateOrderSummary(calculationResult, cartItems, productList) {
  const summaryDetails = $("#summary-details");
  if (!summaryDetails) return;

  const { subTot, itemCnt, itemDiscounts, isTuesday } = calculationResult;

  let summaryHTML = "";

  if (subTot > 0) {
    // 각 장바구니 아이템 정보 추가
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      let curItem = null;

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItem.id) {
          curItem = productList[j];
          break;
        }
      }

      if (!curItem) continue;

      const q = cartItem.quantity;
      const itemTotal = curItem.val * q;

      summaryHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 구분선 추가
    summaryHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 대량구매 할인 표시
    if (itemCnt >= 30) {
      summaryHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      // 개별 상품 할인 표시
      itemDiscounts.forEach(function (item) {
        summaryHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인 표시
    if (isTuesday) {
      summaryHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    // 배송 정보 추가
    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  setElementHTML(summaryDetails, summaryHTML);
}

/**
 * 할인 정보 업데이트 - 원본과 동일
 * @param {Object} calculationResult - 계산 결과
 */
export function updateDiscountInfo(calculationResult) {
  const discountInfo = $("#discount-info");
  if (!discountInfo) return;

  const { discRate, totalAmt, originalTotal } = calculationResult;

  discountInfo.innerHTML = "";

  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

/**
 * 장바구니 UI 업데이트 - 원본과 동일
 * @param {Object} calculationResult - 계산 결과
 */
export function updateCartUI(calculationResult) {
  const { itemCnt, totalAmt } = calculationResult;

  // 아이템 수량 표시 업데이트
  const itemCountElement = $("#item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
  }

  // 총액 표시 업데이트
  const totalDiv = $("#cart-total .text-2xl");
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
}

/**
 * 보너스 포인트 업데이트 - 원본과 동일
 * @param {Object} calculationResult - 계산 결과
 * @param {Array} cartItems - 장바구니 아이템들 (DOM 요소 배열)
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function updateBonusPoints(calculationResult, cartItems, productList, appState) {
  const loyaltyPoints = document.getElementById("loyalty-points");
  if (!loyaltyPoints) return;

  const { totalAmt } = calculationResult;

  // 빈 장바구니 확인 - 원본과 동일 (cartDisp.children.length === 0)
  const cartDisp = $("#cart-items");
  if (!cartDisp || cartDisp.children.length === 0) {
    setElementVisibility(loyaltyPoints, false);
    return;
  }

  // 상세 포인트 계산 및 표시 - 원본과 동일
  const bonusPointsResult = calculateBonusPoints(cartItems, productList, appState, totalAmt);
  const { finalPoints, pointsDetail } = bonusPointsResult;

  if (finalPoints > 0) {
    setElementHTML(
      loyaltyPoints,
      '<div>적립 포인트: <span class="font-bold">' +
        finalPoints +
        "p</span></div>" +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(", ") +
        "</div>",
    );
    setElementVisibility(loyaltyPoints, true);
  } else {
    setElementText(loyaltyPoints, "적립 포인트: 0p");
    setElementVisibility(loyaltyPoints, true);
  }
}

/**
 * 재고 정보 업데이트 - 원본과 동일
 * @param {Array} productList - 상품 목록
 */
export function updateStockInfo(productList) {
  const stockInfo = $("#stock-info");
  if (!stockInfo) return;

  let stockMsg = "";

  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        stockMsg = stockMsg + item.name + ": 품절\n";
      }
    }
  }

  setElementText(stockInfo, stockMsg);
}
