import React from 'react';
import { CartItem } from '../types';
import { DiscountInfo } from '../types/discount';
import { UI_CONSTANTS } from '../constants';
import { createTuesdayDiscountItem } from '../utils';
import { CartItemSummary } from './CartItemSummary';
import { SubtotalSection } from './SubtotalSection';
import { DiscountSummary } from './DiscountSummary';
import { ShippingSummary } from './ShippingSummary';

interface CartSummaryProps {
  items: CartItem[];
  discountInfo: DiscountInfo | null;
  totalAmount: number;
  tuesdaySpecial: boolean;
}

/**
 * 장바구니 아이템 요약 컴포넌트
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  discountInfo,
  totalAmount,
  tuesdaySpecial
}) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">{UI_CONSTANTS.TEXT.EMPTY_CART}</p>;
  }

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const summaryItems = [];

  // 장바구니 아이템들
  items.forEach(item => {
    summaryItems.push(
      <CartItemSummary key={item.id} item={item} />
    );
  });

  // Subtotal 및 할인 정보 추가
  if (subtotal > 0) {
    summaryItems.push(<SubtotalSection key="subtotal" items={items} />);
    
    // 할인 정보
    const discountSummary = (
      <DiscountSummary 
        key="discount" 
        items={items} 
        discountInfo={discountInfo} 
      />
    );
    if (discountSummary) {
      summaryItems.push(discountSummary);
    }
    
    // 화요일 할인
    const tuesdayDiscountItem = createTuesdayDiscountItem(tuesdaySpecial, totalAmount);
    if (tuesdayDiscountItem) {
      summaryItems.push(
        <div key={tuesdayDiscountItem.key} className={tuesdayDiscountItem.className}>
          <span className="text-xs">{tuesdayDiscountItem.label}</span>
          <span className="text-xs">{tuesdayDiscountItem.value}</span>
        </div>
      );
    }
    
    // 배송
    summaryItems.push(<ShippingSummary key="shipping" />);
  }

  return <>{summaryItems}</>;
}; 