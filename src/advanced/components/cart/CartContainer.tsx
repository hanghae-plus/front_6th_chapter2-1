import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useTimer } from '../../contexts/TimerContext';
import { getDiscountType } from '../../utils/discountUtils';
import CartItem from './CartItem';

interface CartContainerProps {
  cartItems: ReadonlyArray<CartItemType>;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartContainer: React.FC<CartContainerProps> = ({
  cartItems,
  onQuantityChange,
  onRemoveItem,
}) => {
  const { timerState } = useTimer();

  // 할인 타입 확인 함수
  const getItemDiscountType = (productId: string) => {
    return getDiscountType(
      productId,
      timerState.flashSaleProductId,
      timerState.recommendationProductId
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        장바구니 ({cartItems.length}개 상품)
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          장바구니가 비어있습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
              discountType={getItemDiscountType(item.product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CartContainer;
