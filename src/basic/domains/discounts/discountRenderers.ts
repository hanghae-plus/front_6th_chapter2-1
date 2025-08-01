import { IDiscountData } from "../../types";

/**
 * 할인 정보 데이터 계산 (순수 함수)
 * @param {number} discountRate - 할인율
 * @param {number} totalAmount - 총 금액
 * @param {number} originalTotal - 원래 총액
 * @returns {Object} 할인 정보 데이터
 */
export function calculateDiscountInfoData(
  discountRate: number,
  totalAmount: number,
  originalTotal: number,
): IDiscountData {
  const hasDiscount = discountRate > 0 && totalAmount > 0;
  const savedAmount = hasDiscount ? originalTotal - totalAmount : 0;
  const discountPercentage = hasDiscount ? (discountRate * 100).toFixed(1) : "0.0";

  return {
    hasDiscount,
    savedAmount,
    discountPercentage,
    formattedSavedAmount: `₩${Math.round(savedAmount).toLocaleString()}`,
  };
}

/**
 * 할인 정보 HTML 템플릿 생성 (순수 함수)
 * @param {Object} discountData - 할인 정보 데이터
 * @returns {string} HTML 템플릿 문자열
 */
export function createDiscountInfoHTML(discountData: IDiscountData): string {
  if (!discountData.hasDiscount) {
    return "";
  }

  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${discountData.discountPercentage}%</span>
      </div>
      <div class="text-2xs text-gray-300">${discountData.formattedSavedAmount} 할인되었습니다</div>
    </div>
  `;
}

/**
 * 할인 정보 렌더러 객체
 * DOM 조작만 담당
 */
export const DiscountInfoRenderer = {
  /**
   * 할인 정보 패널 렌더링
   * @param {Object} discountData - 할인 정보 데이터
   */
  render(discountData: IDiscountData): void {
    const discountInfoDiv = document.getElementById("discount-info");
    if (!discountInfoDiv) return;

    discountInfoDiv.innerHTML = "";

    if (discountData.hasDiscount) {
      const html = createDiscountInfoHTML(discountData);
      discountInfoDiv.innerHTML = html;
    }
  },
};
