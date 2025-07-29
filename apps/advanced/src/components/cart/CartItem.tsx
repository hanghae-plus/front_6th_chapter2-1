import React from 'react';
import { CartItem as CartItemType } from '../../types/cart.types';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  productName: string;
  productId: string;
  maxStock: number;
}

const QuantityControl = React.memo(
  ({
    quantity,
    onQuantityChange,
    productName,
    productId,
    maxStock
  }: QuantityControlProps) => {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(e.target.value, 10);
      if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity <= maxStock) {
        onQuantityChange(newQuantity);
      }
    };

    const handleIncrement = () => {
      if (quantity < maxStock) {
        onQuantityChange(quantity + 1);
      }
    };

    const handleDecrement = () => {
      if (quantity > 0) {
        onQuantityChange(quantity - 1);
      }
    };

    return (
      <div className='flex items-center gap-2'>
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className='w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          aria-label={`${productName} 수량 감소`}
          data-testid={`decrease-${productId}`}>
          -
        </button>

        <input
          type='number'
          min='1'
          max={maxStock}
          value={quantity}
          onChange={handleQuantityChange}
          className='w-16 h-8 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          aria-label={`${productName} 수량`}
          data-testid={`quantity-${productId}`}
        />

        <button
          onClick={handleIncrement}
          disabled={quantity >= maxStock}
          className='w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          aria-label={`${productName} 수량 증가`}
          data-testid={`increase-${productId}`}>
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
const ProductInfo = React.memo(
  ({ product, quantity, subtotal, discount }: ProductInfoProps) => {
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

export const CartItem = React.memo(
  ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
    const handleQuantityChange = (quantity: number) => {
      onUpdateQuantity(item.product.id, quantity);
    };

    const handleRemove = () => {
      onRemove(item.product.id);
    };

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
              productId={item.product.id}
              maxStock={item.product.stock}
            />

            <button
              onClick={handleRemove}
              className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors'
              aria-label={`${item.product.name} 장바구니에서 삭제`}
              data-testid={`remove-${item.product.id}`}>
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CartItem.displayName = 'CartItem';
