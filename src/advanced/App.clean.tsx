import React from 'react';
import { Product, CartItem } from './types';
import Header from './components/common/Header';
import Layout from './components/common/Layout';
import HelpModal from './components/common/HelpModal';

// Custom Hooks
import {
  useProducts,
  useCart,
  useOrderCalculation,
  useDiscountActions,
  useDiscountTimers,
} from './hooks';

interface AppProps {
  productList?: Product[];
  initialCartItems?: CartItem[];
}

export default function App({
  productList = [],
  initialCartItems = [],
}: AppProps) {
  // 상품 관리
  const {
    products,
    applyLightningSale,
    applySuggestionSale,
    getAvailableProductsForLightning,
    getAvailableProductsForSuggestion,
  } = useProducts(productList);

  // 장바구니 관리
  const {
    cartItems,
    selectedProductId,
    lastSelectedProduct,
    setSelectedProductId,
    addToCart,
    updateQuantity,
    removeItem,
    updateCartItemPrices,
    getTotalItemCount,
  } = useCart(initialCartItems);

  // 주문 계산
  const { total, loyaltyPoints, discountInfo, showTuesdaySpecial, cartTotals } =
    useOrderCalculation(cartItems);

  // 할인 액션
  const { handleLightningSale, handleProductSuggestion } = useDiscountActions({
    getAvailableProductsForLightning,
    getAvailableProductsForSuggestion,
    applyLightningSale,
    applySuggestionSale,
    updateCartItemPrices,
    cartItems,
    lastSelectedProduct,
    products,
  });

  // 할인 타이머
  useDiscountTimers({
    onLightningSale: handleLightningSale,
    onSuggestionSale: handleProductSuggestion,
  });

  // 이벤트 핸들러들
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product || product.quantity === 0) return;

    addToCart(product);
  };

  const handleQuantityChange = (productId: string, change: number) => {
    updateQuantity(productId, change);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
  };

  return (
    <div id="app">
      <Header itemCount={getTotalItemCount()} />
      <Layout
        productList={products}
        cartItems={cartItems}
        selectedProductId={selectedProductId}
        total={total}
        loyaltyPoints={loyaltyPoints}
        discountInfo={discountInfo}
        showTuesdaySpecial={showTuesdaySpecial}
        cartTotals={cartTotals}
        onProductChange={handleProductChange}
        onAddToCart={handleAddToCart}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
      <HelpModal />
    </div>
  );
}
