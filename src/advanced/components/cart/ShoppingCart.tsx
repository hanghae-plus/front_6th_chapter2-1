import React from 'react';

import type { ShoppingCartProps } from '../../types/shoppingCart';
import CartItemDisplay from './CartItemDisplay';
import ProductPicker from './ProductPicker';

const ShoppingCart: React.FC<ShoppingCartProps> = ({ products, cartItems, setCartItems }) => {
  return (
    <>
      <ProductPicker products={products} cartItems={cartItems} setCartItems={setCartItems} />
      <div id="cart-items">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return (
            <CartItemDisplay
              key={item.productId}
              product={product}
              quantity={item.quantity}
              onIncrease={() => {
                if (item.quantity >= product.quantity) {
                  alert('재고가 부족합니다');
                  return;
                }
                setCartItems((prev) =>
                  prev.map((ci) => (ci.productId === item.productId ? { ...ci, quantity: ci.quantity + 1 } : ci))
                );
              }}
              onDecrease={() =>
                setCartItems((prev) =>
                  prev.map((ci) =>
                    ci.productId === item.productId && ci.quantity > 1 ? { ...ci, quantity: ci.quantity - 1 } : ci
                  )
                )
              }
              onRemove={() => setCartItems((prev) => prev.filter((ci) => ci.productId !== item.productId))}
            />
          );
        })}
      </div>
    </>
  );
};

export default ShoppingCart;
