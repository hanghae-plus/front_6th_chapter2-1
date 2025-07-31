import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <p className="text-gray-500">장바구니가 비어있습니다</p>
        <p className="text-sm text-gray-400 mt-2">상품을 선택하고 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">장바구니 ({cartItems.length}개 상품)</h3>

      <div className="space-y-3">
        {cartItems.map((item, index) => (
          <div
            key={item.product.id}
            id={item.product.id}
            className={`bg-white border border-gray-200 rounded-lg p-4 ${
              index === 0 ? 'first:pt-0' : ''
            } ${index === cartItems.length - 1 ? 'last:border-b-0' : ''}`}
          >
            <div className="flex items-center justify-between">
              {/* 상품 정보 */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  {/* 상품 이미지 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {item.product.name.charAt(0)}
                  </div>

                  {/* 상품명과 가격 */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                  </div>
                </div>
              </div>

              {/* 수량 조절 */}
              <div className="flex items-center space-x-2">
                <button
                  className="quantity-change w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  data-change="-1"
                  onClick={() => onDecreaseQuantity(item.product.id)}
                  aria-label="수량 감소"
                >
                  -
                </button>

                <span className="quantity-number w-12 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  className="quantity-change w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  data-change="1"
                  onClick={() => onIncreaseQuantity(item.product.id)}
                  aria-label="수량 증가"
                >
                  +
                </button>
              </div>

              {/* 총액 */}
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>

              {/* 제거 버튼 */}
              <button
                className="remove-item ml-2 text-red-500 hover:text-red-700 transition-colors"
                onClick={() => onRemoveItem(item.product.id)}
                aria-label="상품 제거"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
