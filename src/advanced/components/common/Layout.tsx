import React from 'react';
import { Product, CartItem } from '../../types';
import { CartTotals } from '../../services/discountService';
import LeftPanel from './LeftPanel';
import OrderSummary from './OrderSummary';

interface LayoutProps {
  productList: Product[];
  cartItems: CartItem[];
  selectedProductId?: string;
  total?: number;
  loyaltyPoints?: number;
  discountInfo?: string;
  showTuesdaySpecial?: boolean;
  cartTotals?: CartTotals;
  onProductChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddToCart?: () => void;
  onQuantityChange?: (productId: string, change: number) => void;
  onRemove?: (productId: string) => void;
  onCheckout?: () => void;
}

export default function Layout({
  productList,
  cartItems,
  selectedProductId,
  total,
  loyaltyPoints,
  discountInfo,
  showTuesdaySpecial,
  cartTotals,
  onProductChange,
  onAddToCart,
  onQuantityChange,
  onRemove,
  onCheckout,
}: LayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <LeftPanel
        productList={productList}
        cartItems={cartItems}
        selectedProductId={selectedProductId}
        onProductChange={onProductChange}
        onAddToCart={onAddToCart}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
      <OrderSummary
        total={total}
        loyaltyPoints={loyaltyPoints}
        discountInfo={discountInfo}
        showTuesdaySpecial={showTuesdaySpecial}
        cartItems={cartItems}
        cartTotals={cartTotals}
        onCheckout={onCheckout}
      />
    </div>
  );
}
