import { ICartItemData } from "../../types";
import { DISCOUNT_RULES } from "../../constants";
import { useProductData } from "../products/productData";
import { getKoreanDayName } from "../../utils/dateUtils";

/**
 * 주문 요약 데이터 계산 (순수 함수)
 * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
 * @param {number} subtotal - 소계
 * @param {number} itemCount - 총 상품 개수
 * @param {Array} itemDiscounts - 개별 상품 할인 목록
 * @param {boolean} isSpecialDiscount - 특별 할인 여부
 * @param {number} totalAmount - 총 금액
 * @returns {Object} 주문 요약 데이터
 */
export function calculateOrderSummaryData(
  cartItems: HTMLCollection,
  subtotal: number,
  itemCount: number,
  itemDiscounts: any[],
  isSpecialDiscount: boolean,
  totalAmount: number,
) {
  const items: any[] = [];
  for (let i = 0; i < cartItems.length; i += 1) {
    const cartItemElem = cartItems[i] as HTMLElement;
    const product = useProductData.findProductById(cartItemElem.id);

    const hasProduct = !!product;
    if (!hasProduct) continue;

    const quantityElem = cartItemElem.querySelector(".quantity-number") as HTMLElement;
    const hasQuantityText = !!quantityElem?.textContent;
    if (!hasQuantityText) continue;

    if (!quantityElem.textContent) continue;
    const quantity = parseInt(quantityElem.textContent, 10);
    const itemTotal = product.val * quantity;

    items.push({
      name: product.name,
      quantity,
      itemTotal,
    });
  }

  const discounts = {
    hasBulkDiscount: itemCount >= DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD,
    bulkDiscountRate: DISCOUNT_RULES.BULK_DISCOUNT_RATE,
    bulkDiscountThreshold: DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD,
    itemDiscounts,
    itemDiscountThreshold: DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD,
    hasSpecialDiscount: isSpecialDiscount && totalAmount > 0,
    specialDiscountDays: DISCOUNT_RULES.SPECIAL_DISCOUNT_DAYS.map(getKoreanDayName).join(", "),
    specialDiscountRate: DISCOUNT_RULES.SPECIAL_DISCOUNT_RATE,
  };

  return {
    items,
    subtotal,
    discounts,
    shouldRender: subtotal > 0,
  };
}

/**
 * 주문 요약 HTML 템플릿 생성 (순수 함수)
 * @param {Object} summaryData - 주문 요약 데이터
 * @returns {string} HTML 템플릿 문자열
 */
export function createOrderSummaryHTML(summaryData: any) {
  if (!summaryData.shouldRender) {
    return "";
  }

  const itemsHTML = summaryData.items
    .map(
      (item: any) => `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${item.name} x ${item.quantity}</span>
        <span>₩${item.itemTotal.toLocaleString()}</span>
      </div>
    `,
    )
    .join("");

  const subtotalHTML = `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${summaryData.subtotal.toLocaleString()}</span>
    </div>
  `;

  let discountsHTML = "";

  if (summaryData.discounts.hasBulkDiscount) {
    discountsHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${summaryData.discounts.bulkDiscountThreshold}개 이상)</span>
        <span class="text-xs">-${summaryData.discounts.bulkDiscountRate}%</span>
      </div>
    `;
  } else if (summaryData.discounts.itemDiscounts.length > 0) {
    summaryData.discounts.itemDiscounts.forEach(function (item: any) {
      discountsHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (${summaryData.discounts.itemDiscountThreshold}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  let specialDiscountHTML = "";
  if (summaryData.discounts.hasSpecialDiscount) {
    specialDiscountHTML = `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 ${summaryData.discounts.specialDiscountDays} 추가 할인</span>
        <span class="text-xs">-${summaryData.discounts.specialDiscountRate}%</span>
      </div>
    `;
  }

  return itemsHTML + subtotalHTML + discountsHTML + specialDiscountHTML;
}

/**
 * 주문 요약 렌더러 객체
 * DOM 조작만 담당
 */
export const OrderSummaryRenderer = {
  /**
   * 주문 요약 렌더링
   * @param {Object} summaryData - 주문 요약 데이터
   */
  render(summaryData: any): void {
    const summaryDetails = document.getElementById("summary-details");
    if (!summaryDetails) return;

    summaryDetails.innerHTML = "";

    if (!summaryData.shouldRender) {
      return;
    }

    const html = createOrderSummaryHTML(summaryData);
    summaryDetails.innerHTML = html;
  },
};

/**
 * 장바구니 아이템 가격 표시 데이터 계산 (순수 함수)
 * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
 * @returns {Array} 아이템별 가격 표시 데이터 배열
 */
export function calculateCartItemPricesData(cartItems: HTMLCollection): ICartItemData[] {
  const itemsData: ICartItemData[] = [];

  for (let i = 0; i < cartItems.length; i += 1) {
    const itemId = cartItems[i].id;
    const product = useProductData.findProductById(itemId);

    if (product) {
      let priceHTML;
      let nameText;
      let priceClassName;

      if (product.onSale && product.suggestSale) {
        priceHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
        nameText = `⚡💝${product.name}`;
        priceClassName = "text-purple-600";
      } else if (product.onSale) {
        priceHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameText = `⚡${product.name}`;
        priceClassName = "text-red-500";
      } else if (product.suggestSale) {
        priceHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameText = `💝${product.name}`;
        priceClassName = "text-blue-500";
      } else {
        priceHTML = `₩${product.val.toLocaleString()}`;
        nameText = product.name;
        priceClassName = "";
      }

      itemsData.push({
        itemIndex: i,
        priceHTML,
        nameText,
        priceClassName,
        isDiscounted: product.onSale || product.suggestSale,
      });
    }
  }

  return itemsData;
}

/**
 * 장바구니 아이템 가격 렌더러 객체
 * DOM 조작만 담당
 */
export const CartItemPricesRenderer = {
  /**
   * 장바구니 아이템 가격 표시 렌더링
   * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
   * @param {Array} itemsData - 아이템별 가격 표시 데이터
   */
  render(cartItems: HTMLCollection, itemsData: ICartItemData[]): void {
    itemsData.forEach(function (itemData) {
      const cartItem = cartItems[itemData.itemIndex];
      const priceDiv = cartItem.querySelector(".text-lg");
      const nameDiv = cartItem.querySelector("h3");

      if (priceDiv) {
        if (itemData.isDiscounted) {
          priceDiv.innerHTML = itemData.priceHTML;
        } else {
          priceDiv.textContent = itemData.priceHTML;
        }
      }

      if (nameDiv) {
        nameDiv.textContent = itemData.nameText;
      }
    });
  },
};
