import React from 'react';
import { CartItem } from '../types';
import { DiscountInfo } from '../types/discount';
import { createBulkDiscountItem } from '../utils';

interface DiscountSummaryProps {
  items: CartItem[];
  discountInfo: DiscountInfo | null;
}

/**
 * 할인 요약 컴포넌트 (대량구매, 개별 상품 할인)
 */
export const DiscountSummary: React.FC<DiscountSummaryProps> = ({ 
  items, 
  discountInfo 
}) => {
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  // 대량구매 할인
  const bulkDiscountItem = createBulkDiscountItem(totalItemCount);
  if (bulkDiscountItem) {
    return (
      <div className={bulkDiscountItem.className}>
        <span className="text-xs">{bulkDiscountItem.label}</span>
        <span className="text-xs">{bulkDiscountItem.value}</span>
      </div>
    );
  }
  
  // 개별 상품 할인
  if (discountInfo && discountInfo.rate > 0) {
    return (
      <div className="flex justify-between text-sm tracking-wide text-green-400">
        <span className="text-xs">{discountInfo.description}</span>
        <span className="text-xs">-{(discountInfo.rate * 100).toFixed(1)}%</span>
      </div>
    );
  }
  
  return null;
}; 