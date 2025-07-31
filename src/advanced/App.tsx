import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product, CartItem } from './types';
import Header from './components/common/Header';
import Layout from './components/common/Layout';
import HelpModal from './components/common/HelpModal';
import {
  calculateCartTotals,
  applyBulkDiscount,
  applyTuesdayDiscount,
} from './services/discountService';
import { calculateTotalPoints } from './services/pointsService';
import {
  WEEKDAYS,
  TIMER_CONFIG,
  DISCOUNT_RATES,
  PRICE_CONFIG,
} from './constants/config';

interface AppProps {
  productList?: Product[];
  initialCartItems?: CartItem[];
}

export default function App({
  productList = [],
  initialCartItems = [],
}: AppProps) {
  const [products, setProducts] = useState<Product[]>(productList);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [discountInfo, setDiscountInfo] = useState('');
  const [showTuesdaySpecial, setShowTuesdaySpecial] = useState(false);
  const [cartTotals, setCartTotals] = useState<any>(null);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string>('');

  const lightningTimerRef = useRef<number | null>(null);
  const suggestionTimerRef = useRef<number | null>(null);

  // 장바구니 아이템 가격 업데이트
  const updateCartItemPrices = useCallback(() => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const updatedProduct = products.find((p) => p.id === item.id);
        return updatedProduct ? { ...item, price: updatedProduct.price } : item;
      })
    );
  }, [products]);

  // 번개세일 처리 로직
  const handleLightningSale = useCallback(() => {
    console.log('🔥 번개세일 실행!', new Date().toLocaleTimeString());
    const availableProducts = products.filter(
      (product) => product.quantity > 0 && !product.onSale
    );

    if (availableProducts.length === 0) {
      console.log('⚠️ 번개세일 가능한 상품이 없습니다');
      return;
    }

    const luckyIndex = Math.floor(Math.random() * availableProducts.length);
    const selectedProduct = availableProducts[luckyIndex];

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              price: Math.round(
                product.originalPrice! * PRICE_CONFIG.LIGHTNING_SALE_MULTIPLIER
              ),
              onSale: true,
            }
          : product
      )
    );

    alert(
      `⚡번개세일! ${selectedProduct.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`
    );

    // 장바구니에 이미 있는 아이템도 업데이트
    updateCartItemPrices();
  }, [products, updateCartItemPrices]);

  // 추천 상품 할인 처리
  const handleProductSuggestion = useCallback(() => {
    console.log('💝 추천할인 실행!', new Date().toLocaleTimeString());
    if (cartItems.length === 0 || !lastSelectedProduct) {
      console.log(
        '⚠️ 추천할인 조건 불만족: 장바구니 비어있음 또는 선택된 상품 없음'
      );
      return;
    }

    const suggestedProduct = products.find(
      (product) =>
        product.id !== lastSelectedProduct &&
        product.quantity > 0 &&
        !product.suggestSale
    );

    if (!suggestedProduct) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === suggestedProduct.id
          ? {
              ...product,
              price: Math.round(
                product.price * PRICE_CONFIG.SUGGESTION_SALE_MULTIPLIER
              ),
              suggestSale: true,
            }
          : product
      )
    );

    alert(
      `💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGESTION * 100}% 추가 할인!`
    );

    updateCartItemPrices();
  }, [cartItems, lastSelectedProduct, products, updateCartItemPrices]);

  // 타이머 설정
  useEffect(() => {
    console.log('⏰ 타이머 설정 시작');

    // 번개세일 타이머
    const lightningDelay =
      Math.random() * TIMER_CONFIG.LIGHTNING_SALE_MAX_DELAY;
    console.log(`⚡ 번개세일 ${lightningDelay.toFixed(0)}ms 후 시작`);
    const lightningTimeout = setTimeout(() => {
      console.log('⚡ 번개세일 타이머 활성화!');
      lightningTimerRef.current = setInterval(
        handleLightningSale,
        TIMER_CONFIG.LIGHTNING_SALE_INTERVAL
      );
    }, lightningDelay);

    // 추천상품 타이머
    const suggestionDelay = Math.random() * TIMER_CONFIG.SUGGESTION_MAX_DELAY;
    console.log(`💝 추천할인 ${suggestionDelay.toFixed(0)}ms 후 시작`);
    const suggestionTimeout = setTimeout(() => {
      console.log('💝 추천할인 타이머 활성화!');
      suggestionTimerRef.current = setInterval(
        handleProductSuggestion,
        TIMER_CONFIG.SUGGESTION_INTERVAL
      );
    }, suggestionDelay);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(lightningTimeout);
      clearTimeout(suggestionTimeout);
      if (lightningTimerRef.current) clearInterval(lightningTimerRef.current);
      if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
    };
  }, [handleLightningSale, handleProductSuggestion]);

  // 장바구니 총액 및 포인트 계산
  useEffect(() => {
    if (cartItems.length === 0) {
      setTotal(0);
      setLoyaltyPoints(0);
      setDiscountInfo('');
      setShowTuesdaySpecial(false);
      setCartTotals(null);
      return;
    }

    // 1. 기본 장바구니 계산
    const calculatedCartTotals = calculateCartTotals(cartItems);
    setCartTotals(calculatedCartTotals);

    // 2. 대량 구매 할인 적용
    const bulkDiscountResult = applyBulkDiscount(calculatedCartTotals);

    // 3. 화요일 할인 적용
    const finalDiscountResult = applyTuesdayDiscount(
      bulkDiscountResult.finalAmount,
      bulkDiscountResult.originalTotal
    );

    // 4. 포인트 계산
    const points = calculateTotalPoints(
      cartItems,
      finalDiscountResult.finalAmount
    );

    // 5. 상태 업데이트
    setTotal(Math.round(finalDiscountResult.finalAmount));
    setLoyaltyPoints(points);

    // 6. 할인 정보 생성
    let discountText = '';
    if (calculatedCartTotals.itemDiscounts.length > 0) {
      discountText = calculatedCartTotals.itemDiscounts
        .map((item: any) => `${item.name}: ${item.discount}% 할인`)
        .join('\n');
    }
    if (calculatedCartTotals.itemCount >= 30) {
      discountText += discountText
        ? '\n대량구매 25% 할인'
        : '대량구매 25% 할인';
    }
    setDiscountInfo(discountText);

    // 7. 화요일 특별 할인 표시
    const today = new Date();
    const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
    setShowTuesdaySpecial(
      isTuesday &&
        finalDiscountResult.finalAmount < finalDiscountResult.originalTotal
    );

    // 8. discount-info DOM 업데이트
    updateDiscountInfoDOM(finalDiscountResult);
  }, [cartItems, products]);

  // discount-info DOM 업데이트
  const updateDiscountInfoDOM = (discountResult: any) => {
    const discountInfoElement = document.getElementById('discount-info');
    if (!discountInfoElement) return;

    discountInfoElement.innerHTML = '';

    if (discountResult.discountRate > 0 && discountResult.finalAmount > 0) {
      const savedAmount =
        discountResult.originalTotal - discountResult.finalAmount;
      const discountPercentage = Math.round(discountResult.discountRate * 100);

      discountInfoElement.innerHTML = `
        <div class="text-xs text-green-400 mb-2">
          💰 총 할인 혜택: ₩${savedAmount.toLocaleString()} (${discountPercentage}% 절약)
        </div>
      `;
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product || product.quantity === 0) return;

    setLastSelectedProduct(selectedProductId);

    const existingItem = cartItems.find(
      (item) => item.id === selectedProductId
    );
    if (existingItem) {
      setCartItems((items) =>
        items.map((item) =>
          item.id === selectedProductId
            ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
            : item
        )
      );
    } else {
      setCartItems((items) => [...items, { ...product, cartQuantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = (item.cartQuantity || 1) + change;
            return newQuantity <= 0
              ? item // 수량이 0 이하가 되면 아이템을 유지 (remove 함수로 따로 처리)
              : { ...item, cartQuantity: newQuantity };
          }
          return item;
        })
        .filter((item) => (item.cartQuantity || 1) > 0)
    );
  };

  const handleRemove = (productId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
  };

  const itemCount = cartItems.reduce(
    (sum, item) => sum + (item.cartQuantity || 1),
    0
  );

  return (
    <div id="app">
      <Header itemCount={itemCount} />
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
