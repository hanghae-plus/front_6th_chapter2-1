/**
 * 장바구니 표시 컴포넌트
 * 선언적 프로그래밍 패러다임을 적용한 장바구니 UI
 */

import React from 'react';
import { useCart } from '../../context/CartContext';
import { useCalculations } from '../../hooks/useCalculations';
import { CartItem as CartItemType } from '../../types/cart.types';
import { CartItem } from './CartItem';
import { OrderSummary } from './OrderSummary';

/**
 * 빈 장바구니 컴포넌트
 * 장바구니가 비어있을 때 표시되는 컴포넌트
 */
const EmptyCart: React.FC = () => {
  return (
    <div className='empty-cart text-center py-8'>
      <div className='mb-4'>
        <svg
          className='w-16 h-16 mx-auto text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
          />
        </svg>
      </div>
      <h3 className='text-lg font-semibold text-gray-600 mb-2'>
        장바구니가 비어있습니다
      </h3>
      <p className='text-gray-500'>상품을 추가해보세요!</p>
    </div>
  );
};

/**
 * 장바구니 헤더 컴포넌트 Props
 */
interface CartHeaderProps {
  itemCount: number;
  onClearCart: () => void;
}

/**
 * 장바구니 헤더 컴포넌트
 * 장바구니 상단의 제목과 정리 버튼을 포함하는 컴포넌트
 */
const CartHeader: React.FC<CartHeaderProps> = React.memo(
  ({ itemCount, onClearCart }) => {
    const handleClearCart = React.useCallback(() => {
      onClearCart();
    }, [onClearCart]);

    return (
      <div className='cart-header flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>
          장바구니 ({itemCount}개 상품)
        </h2>
        <button
          onClick={handleClearCart}
          className='px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors'
          aria-label='장바구니 비우기'>
          장바구니 비우기
        </button>
      </div>
    );
  }
);

CartHeader.displayName = 'CartHeader';

/**
 * 장바구니 아이템 목록 컴포넌트 Props
 */
interface CartItemsListProps {
  items: CartItemType[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

/**
 * 장바구니 아이템 목록 컴포넌트
 * 장바구니 아이템들을 목록 형태로 표시하는 컴포넌트
 */
const CartItemsList: React.FC<CartItemsListProps> = React.memo(
  ({ items, onRemove, onUpdateQuantity }) => {
    const handleRemove = React.useCallback(
      (productId: string) => {
        onRemove(productId);
      },
      [onRemove]
    );

    const handleUpdateQuantity = React.useCallback(
      (productId: string, quantity: number) => {
        onUpdateQuantity(productId, quantity);
      },
      [onUpdateQuantity]
    );

    return (
      <div className='space-y-4 mb-6'>
        {items.map(item => (
          <CartItem
            key={item.product.id}
            item={item}
            onRemove={handleRemove}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </div>
    );
  }
);

CartItemsList.displayName = 'CartItemsList';

/**
 * 장바구니 표시 컴포넌트
 * 장바구니의 전체적인 레이아웃과 상태를 관리하는 메인 컴포넌트
 */
export const CartDisplay: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { subtotal, discount, total, points, itemCount } =
    useCalculations(items);

  const handleRemove = React.useCallback(
    (productId: string) => {
      removeFromCart(productId);
    },
    [removeFromCart]
  );

  const handleUpdateQuantity = React.useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const handleClearCart = React.useCallback(() => {
    clearCart();
  }, [clearCart]);

  // 장바구니가 비어있는 경우
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='cart-display'>
      <CartHeader itemCount={itemCount} onClearCart={handleClearCart} />

      <CartItemsList
        items={items}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <OrderSummary
        subtotal={subtotal}
        discount={discount}
        total={total}
        points={points}
      />
    </div>
  );
};
