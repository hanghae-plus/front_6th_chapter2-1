// ==========================================
// 쇼핑 페이지 컴포넌트 (React + TypeScript)
// ==========================================

import React, { useState } from 'react';
import { ProductSelector } from './ProductSelector';
import { CartDisplay } from './CartDisplay';
import { OrderSummary } from './OrderSummary';
import { Layout, SelectorContainer } from './Layout';
import { StockInfo } from './StockInfo';
import { CartPrices } from './CartPrices';
import { useCartHandlers } from '../hooks/useCartHandlers';
import { useCartCalculations } from '../hooks/useCartCalculations';
import { Product } from '../types';

// 상품 데이터 (재고 관리 포함)
const initialProducts = [
  { id: 'p1', name: '버그 없애는 키보드', quantity: 50, val: 10000, originalVal: 10000, onSale: false, suggestSale: false },
  { id: 'p2', name: '생산성 폭발 마우스', quantity: 30, val: 20000, originalVal: 20000, onSale: false, suggestSale: false },
  { id: 'p3', name: '거북목 탈출 모니터암', quantity: 20, val: 30000, originalVal: 30000, onSale: false, suggestSale: false },
  { id: 'p4', name: '에러 방지 노트북 파우치', quantity: 0, val: 15000, originalVal: 15000, onSale: false, suggestSale: false }, // 품절
  { id: 'p5', name: '코딩할 때 듣는 Lo-Fi 스피커', quantity: 10, val: 25000, originalVal: 25000, onSale: false, suggestSale: false },
];

/**
 * ShoppingPage Props 타입
 */
interface ShoppingPageProps {
  onCartCountChange: (count: number) => void;
}

/**
 * ShoppingPage 컴포넌트
 *
 * @description 쇼핑 기능의 메인 페이지 (상품 선택, 장바구니, 주문 요약)
 */
export const ShoppingPage: React.FC<ShoppingPageProps> = ({ onCartCountChange }) => {
  // 상품 재고 상태 관리
  const [products, setProducts] = useState(initialProducts);
  
  // 장바구니 상태 관리
  const [cartItems, setCartItems] = useState<Product[]>([]);

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

  // 장바구니 개수 변화를 부모에게 알림
  React.useEffect(() => {
    onCartCountChange(cartCount);
  }, [cartCount, onCartCountChange]);

  // useSaleTimers(products, setProducts, cartItems, setCartItems);

  return (
    <>
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
      
      {/* 상태 메시지 */}
     
    </>
  );
};

export default ShoppingPage;