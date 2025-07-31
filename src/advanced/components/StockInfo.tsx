// ==========================================
// 재고 정보 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';
import { THRESHOLDS } from '../constant/index';

/**
 * StockInfo Props 타입
 */
interface StockInfoProps {
  products: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  totalStock: number;
  className?: string;
}

/**
 * StockInfo 컴포넌트
 *
 * @description 각 제품의 재고 상태를 확인하여 부족/품절 알림 메시지를 표시
 *
 * 알림 조건:
 * - 재고 5개 미만: "재고 부족 (N개 남음)" 메시지 표시
 * - 재고 0개: "품절" 메시지 표시
 * - 전체 재고 30개 미만: 표시하지 않음
 */
export const StockInfo: React.FC<StockInfoProps> = ({ 
  products, 
  totalStock, 
  className = 'text-xs text-red-500 mt-3 whitespace-pre-line' 
}) => {
  // 전체 재고가 임계값 미만이면 표시하지 않음
  if (totalStock < THRESHOLDS.STOCK_MANAGEMENT_THRESHOLD) {
    return null;
  }

  // 재고 부족/품절 상품 필터링
  const lowStockItems = products.filter(
    item => item.quantity < THRESHOLDS.LOW_STOCK_WARNING
  );

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div id="stock-status" className={className}>
      {lowStockItems.map((item) => (
        <div key={item.id}>
          {item.name}: {item.quantity > 0 
            ? `재고 부족 (${item.quantity}개 남음)` 
            : '품절'
          }
        </div>
      ))}
    </div>
  );
};

/**
 * 재고 정보 UI 업데이트 (호환성을 위한 유틸리티 함수)
 */
export const updateStockInfoUI = (
  products: Array<{ id: string; name: string; quantity: number }>, 
  totalStock: number, 
  stockInfoElement: HTMLElement | null
) => {
  let infoMsg = '';

  if (totalStock < THRESHOLDS.STOCK_MANAGEMENT_THRESHOLD) {
    return;
  }

  products.forEach(item => {
    if (item.quantity < THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.quantity > 0) {
        infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg + item.name}: 품절\n`;
      }
    }
  });

  if (stockInfoElement) {
    stockInfoElement.textContent = infoMsg;
  }
};

export default StockInfo;