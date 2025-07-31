import { MouseEvent } from 'react';

import { useCartWithProduct } from '@/hooks/useCartWithProducts';

const ShoppingCart = () => {
  const { cartItems: items, updateCartItemQuantity, removeFromCart } = useCartWithProduct();

  const createQuantityButtonHandler = (productId: string, delta: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateCartItemQuantity(productId, delta);
  };

  const handleClickAddButton = (productId: string) => {
    return createQuantityButtonHandler(productId, +1);
  };

  const handleClickMinusButton = (productId: string) => {
    return createQuantityButtonHandler(productId, -1);
  };

  const handleRemove = (productId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    removeFromCart(productId);
  };

  return (
    <div id="cart-items">
      {items.map((item) => (
        <div
          className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
          key={`shoppingcart-${item.id}`}
        >
          <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
          </div>
          <div>
            <h3 className="text-base font-normal mb-1 tracking-tight"></h3>
            <p className="text-xs text-gray-500 mb-0.5 tracking-wide">{item.name}</p>
            <p className="text-xs text-black mb-3">₩{item.discountPrice?.toLocaleString()}</p>
            <div className="flex items-center gap-4">
              <button
                data-product-id="p1"
                className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                onClick={handleClickMinusButton(item.id)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                data-product-id="p1"
                className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                onClick={handleClickAddButton(item.id)}
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg mb-2 tracking-tight tabular-nums">
              <span className="line-through text-gray-400">₩{item.price?.toLocaleString()}</span>
              <span className="text-purple-600">₩{item.discountPrice?.toLocaleString()}</span>
            </div>
            <a
              className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
              data-product-id="p1"
              onClick={handleRemove(item.id)}
            >
              Remove
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;
