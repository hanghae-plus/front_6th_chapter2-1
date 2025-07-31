// ==========================================
// 장바구니 표시 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';

/**
 * CartDisplay 컴포넌트 Props 타입
 */
interface CartDisplayProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * CartDisplay 컴포넌트
 *
 * @description 장바구니 표시 영역
 */
export const CartDisplay: React.FC<CartDisplayProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div id="cart-items" className={className}>
      {children}
    </div>
  );
};

export default CartDisplay;