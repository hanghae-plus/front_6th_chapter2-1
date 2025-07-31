import { CartItem } from '../types/index.js';
import { UI_CONSTANTS } from '../constants/ui.js';
import { getProductSaleStatus, getProductNamePrefix, getProductPriceColorClass } from './productUtils.js';

// ============== 장바구니 표시 관련 유틸리티 함수들 ==============

// 장바구니 아이템 가격 표시 HTML 생성
export const createCartItemPriceDisplay = (item: CartItem): string => {
  const { isOnSale, isSuggestedSale, isDualSale } = getProductSaleStatus(item);
  
  if (isOnSale || isSuggestedSale) {
    const colorClass = getProductPriceColorClass(item);
    return `<span class="line-through text-gray-400">₩${item.originalPrice.toLocaleString()}</span> <span class="${colorClass}">₩${item.price.toLocaleString()}</span>`;
  } else {
    return `₩${item.price.toLocaleString()}`;
  }
};

// 장바구니 아이템 이름 접두사 생성
export const getCartItemNamePrefix = (item: CartItem): string => {
  return getProductNamePrefix(item);
};

// 장바구니 아이템 폰트 굵기 결정
export const getCartItemFontWeight = (quantity: number): string => {
  return quantity >= UI_CONSTANTS.THRESHOLDS.BOLD_TEXT_QUANTITY ? 'bold' : 'normal';
};

// 장바구니 아이템 개별 항목 생성
export const createCartItemSummary = (item: CartItem): {
  name: string;
  quantity: number;
  total: number;
} => {
  return {
    name: item.name,
    quantity: item.quantity,
    total: item.price * item.quantity,
  };
};

// 할인 정보 텍스트 생성
export const createDiscountInfoText = (discountInfo: any): string => {
  if (!discountInfo) return '';
  return `할인: ${(discountInfo.rate * 100).toFixed(1)}% (${discountInfo.description})`;
};

// 포인트 정보 HTML 생성
export const createLoyaltyPointsHTML = (pointsInfo: any): string => {
  if (pointsInfo.total === 0) return `${UI_CONSTANTS.TEXT.LOYALTY_POINTS}0p`;
  
  const descriptions = pointsInfo.description.join(', ');
  return `<div>${UI_CONSTANTS.TEXT.LOYALTY_POINTS}<span class="font-bold">${pointsInfo.total}p</span></div>` +
         `<div class="text-2xs opacity-70 mt-1">${descriptions}</div>`;
};

// 대량구매 할인 항목 생성
export const createBulkDiscountItem = (totalItemCount: number): any => {
  if (totalItemCount >= UI_CONSTANTS.THRESHOLDS.BULK_PURCHASE) {
    return {
      key: 'bulk-discount',
      className: 'flex justify-between text-sm tracking-wide text-green-400',
      label: UI_CONSTANTS.TEXT.BULK_DISCOUNT,
      value: UI_CONSTANTS.TEXT.BULK_DISCOUNT_RATE,
    };
  }
  return null;
};

// 화요일 할인 항목 생성
export const createTuesdayDiscountItem = (isTuesday: boolean, totalAmount: number): any => {
  if (isTuesday && totalAmount > 0) {
    return {
      key: 'tuesday-discount',
      className: 'flex justify-between text-sm tracking-wide text-purple-400',
      label: UI_CONSTANTS.TEXT.TUESDAY_DISCOUNT,
      value: UI_CONSTANTS.TEXT.TUESDAY_DISCOUNT_RATE,
    };
  }
  return null;
};

// 배송 항목 생성
export const createShippingItem = (): any => {
  return {
    key: 'shipping',
    className: 'flex justify-between text-sm tracking-wide text-gray-400',
    label: UI_CONSTANTS.TEXT.SHIPPING,
    value: UI_CONSTANTS.TEXT.FREE_SHIPPING,
  };
}; 