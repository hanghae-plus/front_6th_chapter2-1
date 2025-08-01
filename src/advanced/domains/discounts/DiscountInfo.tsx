import { IDiscountData } from "./types";

interface DiscountInfoProps {
  discountData: IDiscountData;
}

/**
 * Discounts 도메인 - 할인 정보 컴포넌트
 *
 * 기존 DiscountInfoRenderer를 React 컴포넌트로 변환
 * - 총 할인율 표시
 * - 할인된 금액 표시
 * - 할인 적용 시에만 표시
 */
export function DiscountInfo({ discountData }: DiscountInfoProps) {
  if (!discountData.hasDiscount) {
    return null;
  }

  return (
    <div id="discount-info" className="bg-green-500/20 rounded-lg p-3 mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span className="text-sm font-medium text-green-400">{discountData.discountPercentage}%</span>
      </div>
      <div className="text-2xs text-gray-300">{discountData.formattedSavedAmount} 할인되었습니다</div>
    </div>
  );
}
