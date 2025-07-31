import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { ProductSelector } from './components/selector/ProductSelector';
import { Cart } from './components/cart/Cart';
import { OrderSummary } from './components/order/OrderSummary';
import { ManualManager } from './components/manual/ManualManager';
import { Product, OrderSummary as OrderSummaryType } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { applyLightningSale, applyRecommendationSale } from './services/saleService';
import { useCart } from './hooks/useCart';
import { calculatePointsInfo } from './services/cartService';
import { CART_CONSTANTS, COMMON_CONSTANTS } from './constants';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(JSON.parse(JSON.stringify(INITIAL_PRODUCTS)));
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);

  const { cartItems, cartSummary, addToCart, changeQuantity, removeItem } = useCart(products);

  // 자동 세일 설정
  useEffect(() => {
    const setupAutoSales = () => {
      // 번개세일 설정
      const lightningDelay = Math.random() * 10000;
      setTimeout(() => {
        const lightningInterval = setInterval(() => {
          triggerLightningSale();
        }, 30000);
        return () => clearInterval(lightningInterval);
      }, lightningDelay);

      // 추천세일 설정
      setTimeout(() => {
        const recommendationInterval = setInterval(() => {
          triggerRecommendationSale();
        }, 60000);
        return () => clearInterval(recommendationInterval);
      }, Math.random() * 20000);
    };

    setupAutoSales();
  }, []);

  const triggerLightningSale = useCallback(() => {
    const luckyIndex = Math.floor(Math.random() * products.length);
    const luckyProduct = products[luckyIndex];

    if (applyLightningSale(luckyProduct)) {
      alert('⚡번개세일! ' + luckyProduct.name + '이(가) 20% 할인 중입니다!');
      setProducts([...products]); // 상태 업데이트를 위한 강제 리렌더링
    }
  }, [products]);

  const triggerRecommendationSale = useCallback(() => {
    if (!lastSelectedProduct) return;

    const suggestedProduct = findSuggestedProduct();

    if (suggestedProduct && applyRecommendationSale(suggestedProduct)) {
      alert('💝 ' + suggestedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      setProducts([...products]); // 상태 업데이트를 위한 강제 리렌더링
    }
  }, [lastSelectedProduct, products]);

  const findSuggestedProduct = (): Product | null => {
    for (const product of products) {
      if (product.id !== lastSelectedProduct && product.quantity > 0 && !product.suggestSale) {
        return product;
      }
    }
    return null;
  };

  const handleProductSelect = useCallback((productId: string) => {
    setSelectedProductId(productId);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (selectedProductId) {
      addToCart(selectedProductId);
      setLastSelectedProduct(selectedProductId);

      // 재고 감소
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProductId && product.quantity > 0
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    }
  }, [selectedProductId, addToCart]);

  const handleQuantityChange = useCallback(
    (productId: string, change: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const cartItem = cartItems.find((item) => item.productId === productId);
      if (!cartItem) return;

      const newQuantity = cartItem.quantity + change;

      if (newQuantity <= COMMON_CONSTANTS.ZERO) {
        // 아이템 제거
        removeItem(productId);
        // 재고 복구
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + cartItem.quantity } : p))
        );
      } else if (change > 0 && product.quantity > 0) {
        // 수량 증가
        changeQuantity(productId, change);
        // 재고 감소
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p))
        );
      } else if (change < 0) {
        // 수량 감소
        changeQuantity(productId, change);
        // 재고 증가
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + 1 } : p))
        );
      }
    },
    [products, cartItems, changeQuantity, removeItem]
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      const cartItem = cartItems.find((item) => item.productId === productId);
      if (!cartItem) return;

      removeItem(productId);

      // 재고 복구
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + cartItem.quantity } : p))
      );
    },
    [cartItems, removeItem]
  );

  const handleManualToggle = useCallback(() => {
    setIsManualOpen((prev) => !prev);
  }, []);

  const handleOrder = useCallback(() => {
    if (cartItems.length === CART_CONSTANTS.EMPTY_CART) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    // 주문 확인 다이얼로그
    const orderItems = cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return `${product?.name} × ${item.quantity}개`;
      })
      .join('\n');

    const confirmMessage = `주문하시겠습니까?\n\n주문 상품:\n${orderItems}\n\n총 결제금액: ${cartSummary.finalAmount.toLocaleString()}원\n적립 예정 포인트: ${calculatePointsInfo(cartSummary.finalAmount, cartItems, products).totalPoints}p`;

    if (confirm(confirmMessage)) {
      // 주문 처리
      alert('🎉 주문이 완료되었습니다!\n\n감사합니다!');

      // 장바구니 비우기
      cartItems.forEach((item) => {
        removeItem(item.productId);
      });

      // 선택된 상품 초기화
      setSelectedProductId('');
      setLastSelectedProduct(null);
    }
  }, [cartItems, products, cartSummary.finalAmount, removeItem]);

  const orderSummary: OrderSummaryType = {
    subtotal: cartSummary.subtotal,
    totalDiscount: cartSummary.totalDiscount,
    finalAmount: cartSummary.finalAmount,
    itemCount: cartSummary.itemCount,
    bonusPoints: 0, // 포인트는 OrderSummary 컴포넌트에서 계산
    discounts: [],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header itemCount={cartSummary.itemCount} />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* 왼쪽 컬럼 - 상품 선택 + 장바구니 */}
          <div className="space-y-6">
            <ProductSelector products={products} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} />

            <Cart
              items={cartItems}
              products={products}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* 오른쪽 컬럼 - 주문 요약 */}
          <OrderSummary summary={orderSummary} items={cartItems} products={products} onOrder={handleOrder} />
        </div>
      </div>

      {/* 이용 안내 매니저 */}
      <ManualManager isOpen={isManualOpen} onToggle={handleManualToggle} />
    </div>
  );
};
