import React from 'react';
import Selector from './Selector';
import Cart from './Cart';
import { Product } from '../types/product';
import { CartItem } from '../types/cart';

interface LeftContentProps {
  productList: Product[];
  lastSelectedProduct: Product | null;
  onAdd: (productId: string) => void;
  onCartClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  cartItems: CartItem[];
}

const LeftContent: React.FC<LeftContentProps> = ({
  productList,
  lastSelectedProduct,
  onAdd,
  onCartClick,
  cartItems,
}) => {
  return (
    <>
      <Selector
        productList={productList}
        lastSelectedProduct={lastSelectedProduct}
        onAdd={onAdd}
      />
      <Cart
        cartItems={cartItems}
        productList={productList}
        onCartClick={onCartClick}
      />
    </>
  );
};

export default LeftContent;
