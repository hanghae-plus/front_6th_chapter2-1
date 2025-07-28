/**
 * 장바구니 아이템 컴포넌트
 * 선언적 프로그래밍 패러다임을 적용한 장바구니 아이템 UI
 */

import React from 'react';
import { CartItem as CartItemType } from '../../types/cart.types';

/**
 * 장바구니 아이템 컴포넌트 Props
 */
interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

/**
 * 수량 조절 컴포넌트 Props
 */
interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  productName: string;
}

/**
 * 수량 조절 컴포넌트
 * 수량 증가/감소 버튼과 입력 필드를 포함하는 컴포넌트
 */
const QuantityControl: React.FC<QuantityControlProps> = React.memo(
  ({ quantity, onQuantityChange, productName }) => {
    const handleQuantityChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
          onQuantityChange(newQuantity);
        }
      },
      [onQuantityChange]
    );

    const handleIncrement = React.useCallback(() => {
      onQuantityChange(quantity + 1);
    }, [quantity, onQuantityChange]);

    const handleDecrement = React.useCallback(() => {
      if (quantity > 1) {
        onQuantityChange(quantity - 1);
      }
    }, [quantity, onQuantityChange]);

    return (
      <div className='flex items-center gap-2'>
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className='w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          aria-label={`${productName} 수량 감소`}>
          -
        </button>

        <input
          type='number'
          min='1'
          value={quantity}
          onChange={handleQuantityChange}
          className='w-16 h-8 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          aria-label={`${productName} 수량`}
        />

        <button
          onClick={handleIncrement}
          className='w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center justify-center'
          aria-label={`${productName} 수량 증가`}>
          +
        </button>
      </div>
    );
  }
);

QuantityControl.displayName = 'QuantityControl';

/**
 * 상품 정보 컴포넌트 Props
 */
interface ProductInfoProps {
  product: CartItemType['product'];
  quantity: number;
  subtotal: number;
  discount: number;
}

/**
 * 상품 정보 컴포넌트
 * 상품의 기본 정보와 가격 정보를 표시하는 컴포넌트
 */
const ProductInfo: React.FC<ProductInfoProps> = React.memo(
  ({ product, quantity, subtotal, discount }) => {
    const hasDiscount = discount > 0;
    const finalPrice = subtotal - discount;

    return (
      <div className='flex-1'>
        <div className='mb-3'>
          <h4 className='text-lg font-semibold text-gray-800 mb-1'>
            {product.name}
          </h4>
          <p className='text-gray-600 text-sm mb-2'>{product.description}</p>
          <p className='text-gray-700 font-medium'>
            단가: {product.price.toLocaleString()}원
          </p>
        </div>

        <div className='space-y-1'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>수량:</span>
            <span className='font-medium'>{quantity}개</span>
          </div>

          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>소계:</span>
              <span className='font-medium'>{subtotal.toLocaleString()}원</span>
            </div>

            {hasDiscount && (
              <div className='flex justify-between text-green-600'>
                <span>할인:</span>
                <span>-{discount.toLocaleString()}원</span>
              </div>
            )}

            <div className='flex justify-between text-lg font-bold text-blue-600'>
              <span>최종:</span>
              <span>{finalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductInfo.displayName = 'ProductInfo';

/**
 * 장바구니 아이템 컴포넌트
 * 개별 장바구니 아이템을 표시하고 관리하는 컴포넌트
 */
export const CartItem: React.FC<CartItemProps> = React.memo(
  ({ item, onRemove, onUpdateQuantity }) => {
    const handleQuantityChange = React.useCallback(
      (quantity: number) => {
        onUpdateQuantity(item.product.id, quantity);
      },
      [item.product.id, onUpdateQuantity]
    );

    const handleRemove = React.useCallback(() => {
      onRemove(item.product.id);
    }, [item.product.id, onRemove]);

    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
        <div className='flex items-start justify-between'>
          <ProductInfo
            product={item.product}
            quantity={item.quantity}
            subtotal={item.subtotal}
            discount={item.discount}
          />

          <div className='flex flex-col items-end gap-3'>
            <QuantityControl
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              productName={item.product.name}
            />

            <button
              onClick={handleRemove}
              className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors'
              aria-label={`${item.product.name} 장바구니에서 삭제`}>
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CartItem.displayName = 'CartItem';
