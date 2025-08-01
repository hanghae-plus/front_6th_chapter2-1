import { IProduct } from "../../types";

interface StockWarningProps {
  products: IProduct[];
  warningMessage: string;
}

/**
 * Stock 도메인 - 재고 경고 컴포넌트
 *
 * 재고 부족/품절 상품 경고 표시
 * - 재고 부족 상품 목록
 * - 품절 상품 표시
 * - 경고 메시지 표시
 */
export function StockWarning({ products, warningMessage }: StockWarningProps) {
  if (!warningMessage.trim()) {
    return null;
  }

  return (
    <div className="bg-orange-500/20 rounded-lg p-4 mt-4">
      <div className="flex items-center mb-2">
        <span className="text-xs uppercase tracking-wide text-orange-400">재고 상태</span>
      </div>

      <div id="stock-status" data-testid="stock-status" className="text-xs text-orange-300 whitespace-pre-line">
        {warningMessage}
      </div>
    </div>
  );
}
