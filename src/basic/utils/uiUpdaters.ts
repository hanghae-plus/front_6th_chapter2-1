import { DISCOUNT_RULES } from "../constants";
import { useProductData } from "../domains/products/productData";
import { useCartManager } from "../domains/cart/cartManager";
import { useBonusPointsManager } from "../domains/points/pointsManager";
import { useStockManager } from "../domains/stock/stockManager";
import { OrderSummaryRenderer } from "../domains/cart/cartRenderers";
import { DiscountInfoRenderer, calculateDiscountInfoData } from "../domains/discounts/discountRenderers";
import { ProductSelectRenderer, calculateProductSelectData } from "../domains/products/productRenderers";
import { CartItemPricesRenderer, calculateCartItemPricesData } from "../domains/cart/cartRenderers";

/**
 * 장바구니 아이템들의 할인 표시 스타일 업데이트
 * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
 */
export function updateCartItemStyles(cartItems: HTMLCollection): void {
  for (let i = 0; i < cartItems.length; i += 1) {
    const cartItem = cartItems[i] as HTMLElement;
    const curItem = useProductData.findProductById(cartItem.id);

    if (curItem) {
      const qtyElem = cartItem.querySelector(".quantity-number") as HTMLElement;
      if (qtyElem?.textContent) {
        const q = parseInt(qtyElem.textContent, 10);
        const itemDiv = cartItem;
        const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");

        priceElems.forEach(function (elem) {
          if (elem.classList.contains("text-lg")) {
            const newFontWeight = q >= DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD ? "bold" : "normal";
            const targetElement = elem as HTMLElement;
            if (targetElement.style.fontWeight !== newFontWeight) {
              targetElement.style.fontWeight = newFontWeight;
            }
          }
        });
      }
    }
  }
}

/**
 * 화요일 특별 할인 UI 표시 업데이트
 * @param {boolean} isSpecialDiscount - 특별 할인 여부
 * @param {number} totalAmount - 총 금액
 */
export function updateSpecialDiscountDisplay(isSpecialDiscount: boolean, totalAmount: number): void {
  const tuesdaySpecial = document.getElementById("tuesday-special");

  if (tuesdaySpecial) {
    if (isSpecialDiscount && totalAmount > 0) {
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  }
}

/**
 * 상품 개수 표시 업데이트
 * @param {number} itemCount - 총 상품 개수
 */
export function updateItemCountDisplay(itemCount: number): void {
  const itemCountElement = document.getElementById("item-count");

  if (itemCountElement && itemCountElement.textContent) {
    const match = itemCountElement.textContent.match(/\d+/);
    const previousCount = parseInt(match ? match[0] : "0", 10);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;

    if (previousCount !== itemCount) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
}

/**
 * 총액 및 포인트 표시 데이터 계산 (순수 함수)
 * @param {number} totalAmount - 총 금액
 * @returns {Object} 총액 및 포인트 표시 데이터
 */
export function calculateTotalAndPointsData(totalAmount: number) {
  const formattedTotal = `₩${totalAmount.toLocaleString()}`;
  const points = Math.floor(totalAmount / 1000); // POINTS_RULES.BASE_CALCULATION_UNIT

  return {
    totalText: formattedTotal,
    points,
    pointsText: `적립 포인트: ${points}p`,
    shouldShowPoints: true,
  };
}

/**
 * 총액 및 포인트 렌더러 객체
 * DOM 조작만 담당
 */
export const TotalPointsRenderer = {
  /**
   * 총액 및 포인트 표시 렌더링
   * @param {Object} displayData - 표시 데이터
   */
  render(displayData: any) {
    const cartSummaryElement = document.getElementById("cart-total");

    const totalDiv = cartSummaryElement?.querySelector(".text-2xl");
    const loyaltyPointsDiv = document.getElementById("loyalty-points");

    if (totalDiv) {
      totalDiv.textContent = displayData.totalText;
    }

    if (loyaltyPointsDiv && displayData.shouldShowPoints) {
      loyaltyPointsDiv.textContent = displayData.pointsText;
      loyaltyPointsDiv.style.display = "block";
    }
  },
};

/**
 * 총액 및 포인트 표시 업데이트 (리팩토링된 버전)
 * @param {number} totalAmount - 총 금액
 */
export function updateTotalAndPointsDisplay(totalAmount: number) {
  const displayData = calculateTotalAndPointsData(totalAmount);
  TotalPointsRenderer.render(displayData);
}

/**
 * 주문 요약 세부 정보 렌더링 (리팩토링된 버전)
 * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
 * @param {number} subtotal - 소계
 * @param {number} itemCount - 총 상품 개수
 * @param {Array} itemDiscounts - 개별 상품 할인 목록
 * @param {boolean} isSpecialDiscount - 특별 할인 여부
 * @param {number} totalAmount - 총 금액
 */
export function renderOrderSummaryDetails(
  cartItems: HTMLCollection,
  subtotal: number,
  itemCount: number,
  itemDiscounts: any[],
  isSpecialDiscount: boolean,
  totalAmount: number,
) {
  const summaryData = calculateOrderSummaryData(
    cartItems,
    subtotal,
    itemCount,
    itemDiscounts,
    isSpecialDiscount,
    totalAmount,
  );
  OrderSummaryRenderer.render(summaryData);
}

/**
 * 할인 정보 패널 렌더링 (리팩토링된 버전)
 * @param {number} discountRate - 할인율
 * @param {number} totalAmount - 총 금액
 * @param {number} originalTotal - 원래 총액
 */
export function renderDiscountInfoPanel(discountRate: number, totalAmount: number, originalTotal: number) {
  const discountData = calculateDiscountInfoData(discountRate, totalAmount, originalTotal);
  DiscountInfoRenderer.render(discountData);
}

/**
 * 상품 선택 옵션 업데이트 (리팩토링된 버전)
 */
export function updateProductSelectOptions() {
  const selectData = calculateProductSelectData();
  ProductSelectRenderer.render(selectData);
}

/**
 * 장바구니 아이템 가격 업데이트 (리팩토링된 버전)
 */
export function updateCartItemPrices() {
  const cartDisplayElement = document.getElementById("cart-items");
  if (!cartDisplayElement) return;

  const cartItems = cartDisplayElement.children;
  const itemsData = calculateCartItemPricesData(cartItems);

  CartItemPricesRenderer.render(cartItems, itemsData);
  updateCartDisplay();
}

/**
 * 포인트 표시 렌더링
 */
export function renderBonusPointsDisplay(): void {
  const cartDisplayElement = document.getElementById("cart-items");
  if (!cartDisplayElement) return;

  const totalAmount = useCartManager.getTotalAmount();
  const itemCount = useCartManager.getItemCount();
  const nodes = cartDisplayElement.children;

  if (cartDisplayElement.children.length === 0) {
    const loyaltyPoints = document.getElementById("loyalty-points");
    if (loyaltyPoints) {
      loyaltyPoints.style.display = "none";
    }
    useBonusPointsManager.resetBonusPoints();
    return;
  }

  const bonusResult = useBonusPointsManager.calculateAndUpdateBonusPoints(totalAmount, itemCount, nodes);

  const finalPoints = bonusResult.totalPoints;
  const pointsDetail = bonusResult.details;

  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (finalPoints > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>`;
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
}

/**
 * 장바구니 계산 및 전체 UI 업데이트
 * 메인 함수: 장바구니 상태 계산 후 모든 UI 컴포넌트 업데이트
 */
export function updateCartDisplay() {
  const cartDisplayElement = document.getElementById("cart-items");
  if (!cartDisplayElement) return;

  const cartItems = cartDisplayElement.children;

  const calculation = useCartManager.updateCartCalculation(cartItems);
  const { subtotal, itemCount, totalAmount, discountRate, originalTotal, isSpecialDiscount, itemDiscounts } =
    calculation;

  updateCartItemStyles(cartItems);
  updateSpecialDiscountDisplay(isSpecialDiscount, totalAmount);
  updateItemCountDisplay(itemCount);
  renderOrderSummaryDetails(cartItems, subtotal, itemCount, itemDiscounts, isSpecialDiscount, totalAmount);
  updateTotalAndPointsDisplay(totalAmount);
  renderDiscountInfoPanel(discountRate, totalAmount, originalTotal);

  useStockManager.updateStockInfoDisplay();
  renderBonusPointsDisplay();
}

// 임포트를 위한 함수들
import { calculateOrderSummaryData } from "../domains/cart/cartRenderers";
