import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext.js';
import { Header, ProductSelect, CartItemList, CartTotal, HelpModal } from './components/index.js';
import { PRODUCT_LIST } from './constants/index.js';
// import { formatPrice } from './utils/formatUtils';

/**
 * 메인 쇼핑카트 컴포넌트
 */
const ShoppingCart: React.FC = () => {
  const {
    products,
    cartState,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    updateQuantity,
    removeFromCart,
    getProductById,
    getLowStockItems,
    getOutOfStockItems,
    // activeSales,
    startAutoEvents,
  } = useAppContext();

  const [isManualOpen, setIsManualOpen] = useState(false);

  // 선택된 상품 정보
  const selectedProduct = getProductById(selectedProductId);

  // 재고 상태 메시지 생성 (장바구니 상태를 반영한 실제 재고 계산)
  const getStockStatusMessage = (): string => {
    const messages: string[] = [];

    // 원본 상품 목록에서 장바구니 수량을 뺀 실제 남은 재고 계산
    PRODUCT_LIST.forEach(originalProduct => {
      const cartItem = cartState.items.find(item => item.id === originalProduct.id);
      const cartQuantity = cartItem ? cartItem.quantity : 0;
      const remainingStock = originalProduct.stock - cartQuantity;

      if (remainingStock === 0) {
        // 품절 상품
        messages.push(`${originalProduct.name}: 품절`);
      } else if (remainingStock > 0 && remainingStock < 5) {
        // 재고 부족 상품 (5개 미만)
        messages.push(`${originalProduct.name}: 재고 부족 (${remainingStock}개 남음)`);
      }
    });

    return messages.join(' | ');
  };

  // 장바구니에 추가
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // 원본 재고 데이터로 검증 (basic과 동일한 로직)
    const currentCartItem = cartState.items.find(item => item.id === selectedProductId);
    const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
    
    // 원본 상품 데이터에서 재고 확인 (PRODUCT_LIST 상수 사용)
    const originalProduct = PRODUCT_LIST.find(p => p.id === selectedProductId);
    if (!originalProduct || originalProduct.stock < currentCartQuantity + 1) {
      alert('재고가 부족합니다.');
      return;
    }

    addToCart(selectedProduct);
    startAutoEvents(selectedProductId);
  };

  // 수량 변경
  const handleQuantityChange = (productId: string, change: number) => {
    const currentItem = cartState.items.find(item => item.id === productId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + change;
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // 증가하는 경우 재고 확인 (basic과 동일한 로직)
    if (change > 0) {
      const originalProduct = PRODUCT_LIST.find(p => p.id === productId);
      if (!originalProduct || newQuantity > originalProduct.stock) {
        alert('재고가 부족합니다.');
        return;
      }
    }

    updateQuantity(productId, newQuantity);
  };

  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col bg-gray-50 text-black antialiased overflow-hidden text-sm">
      {/* Header */}
      <Header itemCount={cartState.totalItemCount} />
      
      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        
        {/* Left Column */}
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          <ProductSelect
            products={products}
            selectedProductId={selectedProductId}
            onProductSelect={setSelectedProductId}
            onAddToCart={handleAddToCart}
            stockStatus={getStockStatusMessage()}
          />

          <div className="mb-6">
            <CartItemList
              items={cartState.items}
              onQuantityChange={handleQuantityChange}
              onRemove={removeFromCart}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-black text-white p-8 flex flex-col">
          <CartTotal
            cartState={cartState}
            lowStockItems={getLowStockItems()}
            outOfStockItems={getOutOfStockItems()}
          />
        </div>
      </div>

      {/* Manual Toggle Button - Fixed Position */}
      <button
        id="manual-toggle-button"
        onClick={() => setIsManualOpen(true)}
        className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>

      {/* Help Modal */}
      <HelpModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />
    </div>
  );
};

/**
 * 애플리케이션 루트 컴포넌트
 */
const App: React.FC = () => {
  return (
    <AppProvider>
      <ShoppingCart />
    </AppProvider>
  );
};

export default App;