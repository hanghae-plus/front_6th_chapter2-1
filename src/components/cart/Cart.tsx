import React from 'react';
import { CartProps } from '../../types';
import { CartProductPrice } from './CartProductPrice';
import { CART_CONSTANTS, PRODUCT_CONSTANTS } from '../../constants';
import { findProductById } from '../../utils/productUtils';

export const Cart: React.FC<CartProps> = ({ items, products, onQuantityChange, onRemoveItem }) => {
  if (items.length === CART_CONSTANTS.EMPTY_CART) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">장바구니</h2>
        <p className="text-gray-500 text-center py-8">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">장바구니</h2>

      <div className="space-y-4">
        {items.map((item) => {
          const product = findProductById(products, item.productId);
          if (!product) {
            return null;
          }

          const totalPrice = product.price * item.quantity;

          return (
            <div key={item.productId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="text-sm text-gray-600">
                    <CartProductPrice product={product} />
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold"
                  aria-label="상품 제거"
                >
                  ×
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onQuantityChange(item.productId, -1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    disabled={item.quantity <= CART_CONSTANTS.MIN_QUANTITY}
                  >
                    -
                  </button>
                  <span className="quantity-number w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(item.productId, 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    disabled={product.quantity === PRODUCT_CONSTANTS.OUT_OF_STOCK}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{totalPrice.toLocaleString()}원</div>
                  <div className="text-sm text-gray-500">
                    {item.quantity}개 × {product.price.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
