import React from 'react';

import type { Product } from '../../types/header';
import CartItemDisplay from './CartItemDisplay';

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, quantity, onIncrease, onDecrease, onRemove }) => {
  return (
    <CartItemDisplay
      product={product}
      quantity={quantity}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onRemove={onRemove}
    />
  );
};

export default CartItem;
