import React from 'react';
import { CartItem as CartItemType } from '../types/cart';
import { Product } from '../types/product';
import CartItem from './CartItem';

interface CartProps {
  cartItems: CartItemType[];
  productList: Product[];
  onCartClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Cart = ({ cartItems, productList, onCartClick }: CartProps) => {
  return (
    <div
      id="cart-items"
      role="group"
      aria-label="Cart Items"
      onClick={onCartClick}
    >
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          장바구니가 비어있습니다.
        </p>
      ) : (
        cartItems.map((item) => {
          return (
            <CartItem key={item.id} item={item} productList={productList} />
          );
        })
      )}
    </div>
  );
};

export default Cart;
