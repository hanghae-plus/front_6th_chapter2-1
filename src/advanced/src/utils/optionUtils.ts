import type { Product } from "../types";

export interface OptionData {
  text: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 옵션 생성
 * @param item - 상품 정보
 * @returns 옵션 정보
 */
export const createOption = (item: Product): OptionData => {
  // 품절 상품 체크
  if (item.quantity === 0) {
    return {
      text: `${item.name} - ${item.val.toLocaleString()}원 (품절)`,
      disabled: true,
      className: "text-gray-400",
    };
  }

  // 번개할인 상품 체크
  if (item.onSale && item.suggestSale) {
    return {
      text: `⚡💝${item.name} - ${item.originalVal.toLocaleString()}원 → ${item.val.toLocaleString()}원 (25% SUPER SALE!)`,
      className: "text-purple-600 font-bold",
    };
  }

  // 번개할인 상품 체크
  if (item.onSale) {
    return {
      text: `⚡${item.name} - ${item.originalVal.toLocaleString()}원 → ${item.val.toLocaleString()}원 (20% SALE!)`,
      className: "text-red-500 font-bold",
    };
  }

  // 추천할인 상품 체크
  if (item.suggestSale) {
    return {
      text: `💝${item.name} - ${item.originalVal.toLocaleString()}원 → ${item.val.toLocaleString()}원 (5% 추천할인!)`,
      className: "text-blue-500 font-bold",
    };
  }

  // 할인 상품이 아닌 경우
  return {
    text: `${item.name} - ${item.val.toLocaleString()}원`,
    className: "",
  };
};
