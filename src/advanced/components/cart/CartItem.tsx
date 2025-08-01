import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { CURRENCY_SYMBOL, CSS_CLASSES } from '../../constants';
import { DiscountIcon } from '../common';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  discountType?:
    | 'flash_sale'
    | 'recommendation'
    | 'super_sale'
    | 'bulk'
    | 'tuesday'
    | null;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemoveItem,
  discountType,
}) => {
  const handleDecreaseQuantity = () => {
    onQuantityChange(item.product.id, -1);
  };

  const handleIncreaseQuantity = () => {
    onQuantityChange(item.product.id, 1);
  };

  const handleRemove = () => {
    onRemoveItem(item.product.id);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3
              className={`font-semibold ${discountType ? 'font-bold' : 'text-gray-800'}`}
            >
              {item.product.name}
            </h3>
            {discountType && <DiscountIcon discountType={discountType} />}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span
              className={
                discountType ? CSS_CLASSES.LINE_THROUGH : 'text-gray-600'
              }
            >
              {CURRENCY_SYMBOL}
              {item.product.price.toLocaleString()}
            </span>
            {discountType && (
              <span className="text-green-600 font-semibold">
                {CURRENCY_SYMBOL}
                {Math.round(
                  item.product.price * (1 - getDiscountRate(discountType))
                ).toLocaleString()}
              </span>
            )}
            <span className="text-gray-500">× {item.quantity}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecreaseQuantity}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            aria-label="수량 감소"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            aria-label="수량 증가"
          >
            +
          </button>
          <button
            onClick={handleRemove}
            className="ml-2 text-red-600 hover:text-red-800 transition-colors"
            aria-label="상품 제거"
          >
            삭제
          </button>
        </div>
      </div>
      <div className="mt-2 text-right">
        <span className="font-semibold text-gray-800">
          {CURRENCY_SYMBOL}
          {item.itemTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// 할인율 반환 함수
const getDiscountRate = (discountType: string): number => {
  switch (discountType) {
    case 'flash_sale':
      return 0.2; // 20%
    case 'recommendation':
      return 0.05; // 5%
    case 'super_sale':
      return 0.25; // 25%
    case 'bulk':
      return 0.25; // 25%
    case 'tuesday':
      return 0.1; // 10%
    default:
      return 0;
  }
};

export default CartItem;
