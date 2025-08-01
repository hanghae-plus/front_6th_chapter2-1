import { IProduct } from "../types";

/**
 * 장바구니 추가 입력 검증 (순수 함수)
 * @param {string} selectedId - 선택된 상품 ID
 * @param {Object} product - 상품 객체
 * @returns {Object} 검증 결과
 */
export function validateAddToCartInput(
  selectedId: string,
  product: IProduct | null,
): { isValid: boolean; reason?: string } {
  if (!selectedId || !product) {
    return { isValid: false, reason: "INVALID_SELECTION" };
  }
  if (product.q <= 0) {
    return { isValid: false, reason: "OUT_OF_STOCK" };
  }
  return { isValid: true };
}

/**
 * 상품 표시 데이터 계산 (순수 함수)
 * @param {Object} product - 상품 객체
 * @returns {Object} 표시 데이터
 */
export function calculateItemDisplayData(product: IProduct): {
  titlePrefix: string;
  priceDisplay: string;
  priceClass: string;
  name: string;
  id: string;
  val: number;
  originalVal: number;
} {
  let titlePrefix = "";
  if (product.onSale && product.suggestSale) {
    titlePrefix = "⚡💝";
  } else if (product.onSale) {
    titlePrefix = "⚡";
  } else if (product.suggestSale) {
    titlePrefix = "💝";
  }

  let priceDisplay = "";
  let priceClass = "";
  if (product.onSale || product.suggestSale) {
    if (product.onSale && product.suggestSale) {
      priceClass = "text-purple-600";
    } else if (product.onSale) {
      priceClass = "text-red-500";
    } else {
      priceClass = "text-blue-500";
    }
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${priceClass}">₩${product.val.toLocaleString()}</span>`;
  } else {
    priceDisplay = `₩${product.val.toLocaleString()}`;
  }

  return {
    titlePrefix,
    priceDisplay,
    priceClass,
    name: product.name,
    id: product.id,
    val: product.val,
    originalVal: product.originalVal,
  };
}

/**
 * 장바구니 아이템 HTML 템플릿 생성 (순수 함수)
 * @param {Object} itemData - 아이템 표시 데이터
 * @returns {string} HTML 템플릿
 */
export function createCartItemHTML(itemData: {
  titlePrefix: string;
  name: string;
  priceDisplay: string;
  id: string;
}): string {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${itemData.titlePrefix}${itemData.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${itemData.priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemData.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemData.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${itemData.priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemData.id}">Remove</a>
    </div>
  `;
}

/**
 * 장바구니 이벤트 타입 결정 (순수 함수)
 * @param {Event} event - 클릭 이벤트
 * @returns {Object} 이벤트 처리 정보
 */
export function parseCartClickEvent(event: MouseEvent): {
  shouldHandle: boolean;
  actionType?: string;
  productId?: string;
  quantityChange?: number;
} {
  const target = event.target as HTMLElement;

  if (!target.classList.contains("quantity-change") && !target.classList.contains("remove-item")) {
    return { shouldHandle: false };
  }

  const { productId } = target.dataset;
  if (!productId) {
    return { shouldHandle: false };
  }

  if (target.classList.contains("quantity-change")) {
    const changeValue = target.dataset.change;
    if (!changeValue) {
      return { shouldHandle: false };
    }
    return {
      shouldHandle: true,
      actionType: "QUANTITY_CHANGE",
      productId,
      quantityChange: parseInt(changeValue, 10),
    };
  }

  if (target.classList.contains("remove-item")) {
    return {
      shouldHandle: true,
      actionType: "REMOVE_ITEM",
      productId,
    };
  }

  return { shouldHandle: false };
}

/**
 * 수량 변경 계산 (순수 함수)
 * @param {number} currentQuantity - 현재 수량
 * @param {number} quantityChange - 수량 변경값
 * @param {number} availableStock - 사용 가능한 재고
 * @returns {Object} 수량 변경 결과
 */
export function calculateQuantityChange(currentQuantity: number, quantityChange: number, availableStock: number) {
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0 && newQuantity <= availableStock + currentQuantity) {
    return {
      isValid: true,
      action: "UPDATE_QUANTITY",
      newQuantity,
      stockChange: -quantityChange,
    };
  }

  if (newQuantity <= 0) {
    return {
      isValid: true,
      action: "REMOVE_ITEM",
      stockChange: currentQuantity,
    };
  }

  return {
    isValid: false,
    reason: "INSUFFICIENT_STOCK",
    message: "재고가 부족합니다.",
  };
}
