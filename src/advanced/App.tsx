import { useState } from 'react';
import { Header } from './components/Header';
import { ProductSelector } from './components/ProductSelector';
import { CartDisplay } from './components/CartDisplay';
import { OrderSummary } from './components/OrderSummary';
import { Layout, SelectorContainer } from './components/Layout';
import { StockInfo } from './components/StockInfo';
import { CartPrices } from './components/CartPrices';
import { useCartHandlers } from './hooks/useCartHandlers';
import { useSaleTimers } from './hooks/useSaleTimers';
import { useCartCalculations } from './hooks/useCartCalculations';

// 상품 데이터 (재고 관리 포함)
const initialProducts = [
  { id: 'p1', name: '버그 없애는 키보드', quantity: 50, val: 10000, originalVal: 10000, onSale: false, suggestSale: false },
  { id: 'p2', name: '생산성 폭발 마우스', quantity: 30, val: 20000, originalVal: 20000, onSale: false, suggestSale: false },
  { id: 'p3', name: '거북목 탈출 모니터암', quantity: 20, val: 30000, originalVal: 30000, onSale: false, suggestSale: false },
  { id: 'p4', name: '에러 방지 노트북 파우치', quantity: 0, val: 15000, originalVal: 15000, onSale: false, suggestSale: false }, // 품절
  { id: 'p5', name: '코딩할 때 듣는 Lo-Fi 스피커', quantity: 10, val: 25000, originalVal: 25000, onSale: false, suggestSale: false },
];

function App() {
  // 상품 재고 상태 관리
  const [products, setProducts] = useState(initialProducts);
  
  // 장바구니 상태 관리
  const [cartItems, setCartItems] = useState([
    { 
      id: 'p1', 
      name: '버그 없애는 키보드', 
      quantity: 2, 
      val: 8000, 
      originalVal: 10000, 
      onSale: true, 
      suggestSale: false 
    },
    { 
      id: 'p2', 
      name: '생산성 폭발 마우스', 
      quantity: 1, 
      val: 15000, 
      originalVal: 20000, 
      onSale: false, 
      suggestSale: true 
    },
  ]);

  // 커스텀 훅들 사용
  const {
    selectedProduct,
    stockInfo,
    handleProductChange,
    handleAddToCart,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout
  } = useCartHandlers(products, setProducts, cartItems, setCartItems);

  const {
    subTotal,
    finalTotal,
    discountRate,
    loyaltyPoints,
    bonusPointsDetail,
    totalStock,
    cartCount,
    itemDiscounts,
    totalItemCount,
    isTuesdayApplied
  } = useCartCalculations(cartItems, products);

  // useSaleTimers(products, setProducts, cartItems, setCartItems);

  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      {/* Header 컴포넌트 */}
      <Header itemCount={cartCount} />
      
      {/* 메인 레이아웃 */}
      <Layout
        leftContent={
          <>
            <SelectorContainer>
              <ProductSelector
                products={products}
                selectedProduct={selectedProduct}
                onProductChange={handleProductChange}
                onAddToCart={handleAddToCart}
                stockInfo={stockInfo}
              />
              
              {/* 재고 정보 */}
              <StockInfo 
                products={products}
                totalStock={totalStock}
              />
            </SelectorContainer>
            
            <CartDisplay>
              <h3 className="text-lg font-semibold mb-4">장바구니</h3>
              {cartItems.length > 0 ? (
                <div>
                  {cartItems.map(item => (
                    <CartPrices 
                      key={item.id}
                      product={item} 
                      quantity={item.quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다.</p>
              )}
            </CartDisplay>
          </>
        }
        rightContent={
          <OrderSummary
            cartItems={cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.val
            }))}
            subTotal={subTotal}
            finalTotal={finalTotal}
            loyaltyPoints={loyaltyPoints}
            bonusPointsDetail={bonusPointsDetail}
            isTuesdayApplied={isTuesdayApplied}
            discounts={itemDiscounts}
            totalItemCount={totalItemCount}
            discountRate={discountRate}
            itemCount={cartCount}
            onCheckout={handleCheckout}
          />
        }
      />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          ✅ Header, ProductSelector, CartDisplay, OrderSummary, Layout, StockInfo, TotalAndDiscount, CartPrices 컴포넌트 변환 완료!
        </p>
      </div>
    </div>
  );
}

export default App;