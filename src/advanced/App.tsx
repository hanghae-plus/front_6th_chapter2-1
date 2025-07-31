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
  } = useCart(products, setProducts);

  // 장바구니 계산 로직 관리
  const { totalAmt, subtotal, discountRate, savedAmount, loyaltyPoints, itemDiscounts, isTuesday } =
    useCartCalculations(cartItems, products, itemCnt);

  // 현재 선택된 상품 (ProductPicker용)
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCT_ONE);

  return (
    <div id="app" className="min-h-screen flex flex-col p-4">
      <Header itemCnt={itemCnt} />
      <GuideToggle />
      <Layout>
        <ShoppingCart
          products={products}
          cartItems={cartItems}
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
          onAddToCart={() => handleAddToCart(selectedProductId)}
          onQuantityChange={handleCartItemQuantityChange}
          onRemoveItem={handleRemoveCartItem}
          stockInfoMessage={stockInfoMessage}
          totalStockQuantity={totalStockQuantity}
        />
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
