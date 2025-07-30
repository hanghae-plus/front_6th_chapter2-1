import React, { useState } from 'react';
import {
  useProducts,
  useCart,
  useLastSelected,
  useLightningSale,
  useSuggestionSale
} from './hooks';
import {
  Header,
  ProductSelector,
  CartItems,
  SummaryDetails,
  DiscountInfo,
  CartTotal,
  TuesdaySpecialBanner,
  HelpModal
} from './components';
import {
  addToCart,
  canAddToCart,
  updateProductStock,
  updateCartQuantity,
  removeFromCart,
  getAvailableStock,
  isTuesday
} from './entities';

/**
 * 메인 애플리케이션 컴포넌트
 * 요구사항: 상품 선택, 장바구니 표시, 주문 요약 화면 구성
 */
export function App() {
  const { products, setProducts, hasLowStock, getStockInfo } = useProducts();
  const { cart, setCart, cartData, pointsData, isEmpty } = useCart(products);
  const { lastSelected, setLastSelected } = useLastSelected();
  
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // 타이머 효과
  useLightningSale(products, setProducts);
  useSuggestionSale(products, setProducts, lastSelected, isEmpty);
  
  /**
   * 상품을 장바구니에 추가
   * 요구사항: 재고 확인, 수량 제한, 마지막 선택 상품 기록
   */
  const handleAddToCart = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product || product.quantity <= 0) return;
    
    const currentQuantity = cart[selectedProductId] || 0;
    
    if (!canAddToCart(product, currentQuantity, 1)) {
      alert('재고가 부족합니다.');
      return;
    }
    
    setCart(addToCart(cart, selectedProductId, 1));
    setProducts(updateProductStock(products, selectedProductId, -1));
    setLastSelected(selectedProductId);
    // 상품 추가 후 선택 유지 (초기화하지 않음)
  };
  
  /**
   * 장바구니 상품 수량 변경
   * 요구사항: 재고 초과 방지, 0개 시 자동 제거
   */
  const handleQuantityChange = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentQuantity = cart[productId] || 0;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity > 0) {
      const availableStock = getAvailableStock(product, currentQuantity);
      if (newQuantity <= availableStock) {
        setCart(updateCartQuantity(cart, productId, newQuantity));
        setProducts(updateProductStock(products, productId, -change));
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      setCart(removeFromCart(cart, productId));
      setProducts(updateProductStock(products, productId, currentQuantity));
    }
  };
  
  /**
   * 장바구니에서 상품 제거
   * 요구사항: 제거 시 재고 수량 복구
   */
  const handleRemoveItem = (productId: string) => {
    const quantity = cart[productId];
    if (!quantity) return;
    
    setCart(removeFromCart(cart, productId));
    setProducts(updateProductStock(products, productId, quantity));
  };
  
  const stockInfo = getStockInfo();
  const stockMessages = stockInfo.lowStockItems.map(item => item.message);
  const showTuesdayBanner = isTuesday(new Date()) && cartData.totalAmount > 0;
  
  return (
    <>
      <Header itemCount={cartData.itemCount} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        {/* 왼쪽: 상품 선택 및 장바구니 */}
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          <ProductSelector
            products={products}
            hasLowStock={hasLowStock()}
            selectedId={selectedProductId}
            onChange={setSelectedProductId}
            onAddToCart={handleAddToCart}
            stockMessages={stockMessages}
          />
          
          <CartItems
            cart={cart}
            products={products}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
        </div>
        
        {/* 오른쪽: 주문 요약 */}
        <div className="bg-black text-white p-8 flex flex-col">
          <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
          
          <div className="flex-1 flex flex-col">
            <div className="space-y-3">
              <SummaryDetails cartData={cartData} />
            </div>
            
            <div className="mt-auto">
              <DiscountInfo cartData={cartData} />
              <CartTotal cartData={cartData} pointsData={pointsData} />
              <TuesdaySpecialBanner show={showTuesdayBanner} />
            </div>
          </div>
          
          <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
            Proceed to Checkout
          </button>
          
          <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
            Free shipping on all orders.<br />
            <span>Earn loyalty points with purchase.</span>
          </p>
        </div>
      </div>
      
      {/* 도움말 버튼 */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}