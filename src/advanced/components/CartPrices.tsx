// ==========================================
// 장바구니 가격 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';
import { Product } from '../types';

/**
 * CartPrices Props 타입
 */
export interface CartPricesProps {
  product: Product;
  quantity?: number;
  className?: string;
  onQuantityChange?: (productId: string, change: number) => void;
  onRemove?: (productId: string) => void;
}


/**
 * 할인 상태 체크 함수들
 */
export const hasBothDiscounts = (product: Product): boolean =>
  product.onSale && product.suggestSale;

export const hasOnSaleOnly = (product: Product): boolean => 
  product.onSale && !product.suggestSale;

export const hasSuggestSaleOnly = (product: Product): boolean => 
  !product.onSale && product.suggestSale;

/**
 * 할인 상태에 따른 상품명 텍스트 생성
 */
export const getDiscountedProductName = (product: Product): string => {
  const icons = [];
  if (product.onSale) {
    icons.push('⚡');
  }
  if (product.suggestSale) {
    icons.push('💝');
  }

  return icons.length > 0 ? `${icons.join('')}${product.name}` : product.name;
};

/**
 * 할인 상태에 따른 가격 색상 결정
 */
const getDiscountColor = (product: Product): string | null => {
  if (hasBothDiscounts(product)) {
    return 'text-purple-600';
  }
  if (hasOnSaleOnly(product)) {
    return 'text-red-500';
  }
  if (hasSuggestSaleOnly(product)) {
    return 'text-blue-500';
  }
  return null;
};

/**
 * CartPrices 컴포넌트
 *
 * @description 장바구니 아이템의 전체 카드 형태로 표시 (이미지, 이름, 가격, 수량 조절 포함)
 */
export const CartPrices: React.FC<CartPricesProps> = ({ 
  product, 
  quantity = 1,
  className = 'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0',
  onQuantityChange,
  onRemove
}) => {
  const discountColor = getDiscountColor(product);
  const totalPrice = product.val * quantity;

  const handleQuantityChange = (change: number) => {
    if (onQuantityChange) {
      onQuantityChange(product.id, change);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(product.id);
    }
  };

  return (
    <div key={product.id} className={className}>
      {/* 상품 이미지 영역 */}
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      
      {/* 상품 정보 영역 */}
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {getDiscountedProductName(product)}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          {discountColor ? (
            <>
              <span className="line-through text-gray-400">
                ₩{product.originalVal.toLocaleString()}
              </span>
              {' '}
              <span className={discountColor}>
                ₩{product.val.toLocaleString()}
              </span>
            </>
          ) : (
            `${product.val.toLocaleString()}원`
          )}
        </p>
        
        {/* 수량 조절 버튼 */}
        <div className="flex items-center gap-4">
          <button 
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(-1)}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button 
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>
      
      {/* 가격 및 제거 버튼 영역 */}
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          {discountColor ? (
            <>
              <span className="line-through text-gray-400">
                ₩{(product.originalVal * quantity).toLocaleString()}
              </span>
              {' '}
              <span className={discountColor}>
                ₩{totalPrice.toLocaleString()}
              </span>
            </>
          ) : (
            `₩${totalPrice.toLocaleString()}`
          )}
        </div>
        <a 
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={handleRemove}
        >
          Remove
        </a>
      </div>
    </div>
  );
};


export default CartPrices;