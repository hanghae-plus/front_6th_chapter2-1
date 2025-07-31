import React from 'react';
import { createShippingItem } from '../utils';

/**
 * 배송 정보 요약 컴포넌트
 */
export const ShippingSummary: React.FC = () => {
  const shippingItem = createShippingItem();
  
  return (
    <div className={shippingItem.className}>
      <span>{shippingItem.label}</span>
      <span>{shippingItem.value}</span>
    </div>
  );
}; 