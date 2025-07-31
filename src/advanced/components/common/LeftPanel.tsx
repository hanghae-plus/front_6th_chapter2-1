import React from 'react';
import { Product, CartItem } from '../../types';
import ProductSelector from '../product/ProductSelector';
import CartList from '../cart/cartList';

interface LeftPanelProps {
  productList: Product[];
  cartItems: CartItem[];
  selectedProductId?: string;
  onProductChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddToCart?: () => void;
  onQuantityChange?: (productId: string, change: number) => void;
  onRemove?: (productId: string) => void;
}

export default function LeftPanel({
  productList,
  cartItems,
  selectedProductId,
  onProductChange,
  onAddToCart,
  onQuantityChange,
  onRemove,
}: LeftPanelProps) {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductSelector
        productList={productList}
        selectedProductId={selectedProductId}
        onProductChange={onProductChange}
        onAddToCart={onAddToCart}
      />
      <CartList
        cartItems={cartItems}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    </div>
  );
}
