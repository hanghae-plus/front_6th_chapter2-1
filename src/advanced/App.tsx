import { useCallback, useEffect, useRef, useState } from 'react';

import { products } from '../data/products.json';
import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';
import { CartItem, Product } from './types';

const App = () => {
  // 상태 관리
  const [productList, setProductList] = useState<Product[]>(products);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const lastSelectedRef = useRef<string | null>(null);

  // 타이머 실행 상태를 추적하는 ref 추가
  const lightningTimerRef = useRef<{ timer: NodeJS.Timeout | null; interval: NodeJS.Timeout | null }>({
    timer: null,
    interval: null,
  });
  const suggestTimerRef = useRef<{ timer: NodeJS.Timeout | null; interval: NodeJS.Timeout | null }>({
    timer: null,
    interval: null,
  });

  // 번개세일 타이머
  useEffect(() => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (lightningTimerRef.current.timer || lightningTimerRef.current.interval) {
      return;
    }

    let isSubscribed = true;
    const lightningDelay = Math.random() * 10000;

    lightningTimerRef.current.timer = setTimeout(() => {
      if (!isSubscribed) return;

      lightningTimerRef.current.interval = setInterval(() => {
        if (!isSubscribed) return;

        setProductList((prevList) => {
          const availableProducts = prevList.filter((p) => p.quantity > 0 && !p.onSale);
          if (availableProducts.length === 0) return prevList;

          const luckyIdx = Math.floor(Math.random() * availableProducts.length);
          const luckyItem = availableProducts[luckyIdx];

          if (isSubscribed) {
            alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          }

          return prevList.map((item) =>
            item.id === luckyItem.id
              ? {
                  ...item,
                  price: Math.round(item.originalPrice * 0.8),
                  onSale: true,
                }
              : item
          );
        });

        // cartItems 업데이트 - 함수형 업데이트 사용
        setCartItems((prev) =>
          prev.map((item) => {
            // 해당 아이템이 번개세일 대상인지 확인
            const product = prev.find((p) => p.id === item.id);
            if (item.onSale) {
              return {
                ...item,
                price: Math.round(item.originalPrice * 0.8),
                onSale: true,
              };
            }
            return item;
          })
        );
      }, 30000);
    }, lightningDelay);

    return () => {
      isSubscribed = false;
      if (lightningTimerRef.current.timer) {
        clearTimeout(lightningTimerRef.current.timer);
        lightningTimerRef.current.timer = null;
      }
      if (lightningTimerRef.current.interval) {
        clearInterval(lightningTimerRef.current.interval);
        lightningTimerRef.current.interval = null;
      }
    };
  }, []); // 빈 의존성 배열 유지

  // 추천 할인 타이머 - lastSelectedRef 변경 감지를 위한 state 추가
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  useEffect(() => {
    // 기존 타이머 정리
    if (suggestTimerRef.current.timer) {
      clearTimeout(suggestTimerRef.current.timer);
    }
    if (suggestTimerRef.current.interval) {
      clearInterval(suggestTimerRef.current.interval);
    }

    if (!lastSelected) return;

    let isSubscribed = true;
    const suggestDelay = Math.random() * 20000;

    suggestTimerRef.current.timer = setTimeout(() => {
      if (!isSubscribed) return;

      suggestTimerRef.current.interval = setInterval(() => {
        if (!isSubscribed) return;

        setProductList((prevList) => {
          const availableProducts = prevList.filter((p) => p.id !== lastSelected && p.quantity > 0 && !p.suggestSale);

          if (availableProducts.length === 0) return prevList;

          const suggest = availableProducts[0];

          if (isSubscribed) {
            alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }

          return prevList.map((item) =>
            item.id === suggest.id
              ? {
                  ...item,
                  price: Math.round(item.price * 0.95),
                  suggestSale: true,
                }
              : item
          );
        });

        // cartItems 업데이트 - 함수형 업데이트 사용
        setCartItems((prev) =>
          prev.map((item) =>
            item.suggestSale
              ? {
                  ...item,
                  price: Math.round(item.price * 0.95),
                  suggestSale: true,
                }
              : item
          )
        );
      }, 60000);
    }, suggestDelay);

    return () => {
      isSubscribed = false;
      if (suggestTimerRef.current.timer) {
        clearTimeout(suggestTimerRef.current.timer);
      }
      if (suggestTimerRef.current.interval) {
        clearInterval(suggestTimerRef.current.interval);
      }
    };
  }, [lastSelected]); // lastSelected를 의존성으로 사용

  useEffect(() => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) => {
        const product = productList.find((p) => p.id === cartItem.id);
        if (!product) return cartItem;
        // 가격, 할인 상태를 항상 최신 productList와 동기화
        return {
          ...cartItem,
          price: product.price,
          originalPrice: product.originalPrice,
          onSale: product.onSale,
          suggestSale: product.suggestSale,
        };
      })
    );
  }, [productList]);

  // 장바구니 관련 핸들러
  const handleAddToCart = useCallback(
    (item: CartItem) => {
      // 재고 체크
      const product = productList.find((p) => p.id === item.id);
      if (!product || product.quantity <= 0) {
        alert('재고가 부족합니다.');
        return;
      }

      // ref와 state 모두 업데이트
      lastSelectedRef.current = item.id;
      setLastSelected(item.id);

      setCartItems((prev) => {
        const existingItem = prev.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          // 장바구니에 이미 있는 경우, 재고 추가 체크
          if (existingItem.quantity + 1 > product.quantity) {
            alert('재고가 부족합니다.');
            return prev;
          }
          return prev.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });

      // 재고 업데이트는 장바구니 업데이트가 성공한 경우에만 실행
      setProductList((prev) => prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p)));
    },
    [productList]
  );

  const handleUpdateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems((prev) => {
      const updatedItems = prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
              setProductList((prevList) =>
                prevList.map((p) => (p.id === itemId ? { ...p, quantity: p.quantity + item.quantity } : p))
              );
              return null;
            }
            setProductList((prevList) =>
              prevList.map((p) => (p.id === itemId ? { ...p, quantity: p.quantity - change } : p))
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      return updatedItems;
    });
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === itemId);
      if (itemToRemove) {
        setProductList((prevList) =>
          prevList.map((p) => (p.id === itemId ? { ...p, quantity: p.quantity + itemToRemove.quantity } : p))
        );
      }
      return prev.filter((item) => item.id !== itemId);
    });
  }, []);
  return (
    <>
      <Header cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      <GuideToggle />
      <Layout>
        <ShoppingCart
          products={productList} // 할인이 적용된 productList 전달
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
        />
        <OrderSummary cartItems={cartItems} />
      </Layout>
    </>
  );
};

export default App;
