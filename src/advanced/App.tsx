import { useState } from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
// Components
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrdereSummary';
// Constants
import { PRODUCT_ONE } from './constants'; // 초기 선택 상품 ID
import { useCart } from './hooks/useCart';
import { useCartCalculations } from './hooks/useCartCalculation';
// Hooks
import { useProducts } from './hooks/useProducts';

const App = () => {
  // 상품 상태 및 관련 로직 관리
  const { products, setProducts, stockInfoMessage, totalStockQuantity } = useProducts([]);
  // 장바구니 상태 및 관련 핸들러 관리
  const {
    cartItems,
    itemCnt,
    handleAddToCart,
    handleCartItemQuantityChange,
    handleRemoveCartItem,
  } = useCart(products, setProducts); // products와 setProducts를 useCart에 전달

  // 장바구니 계산 로직 관리
  const { totalAmt, subtotal, discountRate, savedAmount, loyaltyPoints, itemDiscounts, isTuesday } =
    useCartCalculations(cartItems, products, itemCnt);

  // 현재 선택된 상품 (ProductPicker용)
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCT_ONE);

  return (
    <div id="app" className="min-h-screen flex flex-col p-4">
      {/* Header 컴포넌트에 총 아이템 수를 props로 전달 */}
      <Header itemCnt={itemCnt} />
      {/* GuideToggle 컴포넌트 (매뉴얼 열기 버튼) */}
      <GuideToggle />
      {/* Main Layout */}
      <Layout>
        {/* ShoppingCart 컴포넌트 (왼쪽 컬럼) */}
        <ShoppingCart
          products={products}
          cartItems={cartItems}
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
          onAddToCart={() => handleAddToCart(selectedProductId)} // selectedProductId 전달
          onQuantityChange={handleCartItemQuantityChange}
          onRemoveItem={handleRemoveCartItem}
          stockInfoMessage={stockInfoMessage}
          totalStockQuantity={totalStockQuantity}
        />

        {/* OrderSummary 컴포넌트 (오른쪽 컬럼) */}
        <OrderSummary
          cartItems={cartItems}
          products={products}
          subtotal={subtotal}
          totalAmt={totalAmt}
          discountRate={discountRate}
          savedAmount={savedAmount}
          loyaltyPoints={loyaltyPoints}
          itemDiscounts={itemDiscounts}
          isTuesday={isTuesday}
        />
      </Layout>
    </div>
  );
};

export default App;
