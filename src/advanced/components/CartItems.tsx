import React from 'react';
import { Product, CartItem } from '../types';
import { getProductNameWithBadge, getProductPriceHTML } from '../utils/product';

interface CartItemsProps {
  cartItems: CartItem[];
  productList: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveProduct: (productId: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
  cartItems,
  productList,
  onQuantityChange,
  onRemoveProduct,
}) => {
  if (cartItems.length === 0) {
    return <div className='text-center text-gray-500 py-8'>장바구니가 비어있습니다.</div>;
  }

  return (
    <div>
      {cartItems.map((cartItem, index) => {
        const product = productList.find((p) => p.id === cartItem.productId);
        if (!product) return null;

        const nameWithBadge = getProductNameWithBadge(product);
        const priceHTML = getProductPriceHTML(product);

        return (
          <div
            key={cartItem.productId}
            className={`grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 ${
              index === 0 ? 'first:pt-0' : ''
            } ${index === cartItems.length - 1 ? 'last:border-b-0 last:pb-0' : ''}`}
          >
            <div className='w-20 h-20 bg-gradient-black relative overflow-hidden'>
              <div className='absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45'></div>
            </div>

            <div>
              <h3 className='text-base font-normal mb-1 tracking-tight'>{nameWithBadge}</h3>
              <p className='text-xs text-gray-500 mb-0.5 tracking-wide'>PRODUCT</p>
              <p
                className='text-xs text-black mb-3'
                dangerouslySetInnerHTML={{ __html: priceHTML }}
              />
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => onQuantityChange(cartItem.productId, -1)}
                  className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
                >
                  −
                </button>
                <span className='quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums'>
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(cartItem.productId, 1)}
                  className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
                >
                  +
                </button>
              </div>
            </div>

            <div className='text-right'>
              <div
                className='text-lg mb-2 tracking-tight tabular-nums'
                style={{ fontWeight: cartItem.quantity >= 10 ? 'bold' : 'normal' }}
                dangerouslySetInnerHTML={{ __html: priceHTML }}
              />
              <button
                onClick={() => onRemoveProduct(cartItem.productId)}
                className='remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black'
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
