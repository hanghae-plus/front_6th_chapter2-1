import { useState, useEffect, useCallback } from 'react';

import { TIMER_INTERVAL } from '../constants/constants';
import { Product, CartItem } from '../types';
import { calculateCartTotals } from '../utils/discountUtils';
import { calculateBonusPoints } from '../utils/pointsUtils';
import {
  getInitialProducts,
  getProductById,
  getTotalStock,
  getStockWarnings,
} from '../utils/productUtils';

export const useCartStore = () => {
  const [products, setProducts] = useState<Product[]>(getInitialProducts());
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  // 계산된 값들
  const cartTotals = calculateCartTotals(cartItems, products);
  const bonusPoints = calculateBonusPoints(
    cartItems,
    cartTotals.finalTotal,
    cartTotals.itemCount,
  );
  const stockWarnings = getStockWarnings(products);
  const totalStock = getTotalStock(products);

  // 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      const product = getProductById(products, productId);
      if (!product || product.availableStock <= 0) {
        alert('재고가 부족합니다.');
        return;
      }

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === productId);
        if (existingItem) {
          // 기존 아이템 수량 증가
          return prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        // 새 아이템 추가
        return [...prev, { id: productId, quantity: 1 }];
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, availableStock: p.availableStock - 1 }
            : p,
        ),
      );

      setLastSelected(productId);
    },
    [products],
  );

  // 수량 변경
  const updateQuantity = useCallback(
    (productId: string, change: number) => {
      const product = getProductById(products, productId);
      if (!product) return;

      const currentItem = cartItems.find((item) => item.id === productId);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity + change;

      if (newQuantity <= 0) {
        // 아이템 제거
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  availableStock: p.availableStock + currentItem.quantity,
                }
              : p,
          ),
        );
      } else if (newQuantity <= product.availableStock + currentItem.quantity) {
        // 수량 변경
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item,
          ),
        );
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, availableStock: p.availableStock - change }
              : p,
          ),
        );
      } else {
        alert('재고가 부족합니다.');
      }
    },
    [products, cartItems],
  );

  // 아이템 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      const currentItem = cartItems.find((item) => item.id === productId);
      if (!currentItem) return;

      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, availableStock: p.availableStock + currentItem.quantity }
            : p,
        ),
      );
    },
    [cartItems],
  );

  // 가격 업데이트 (번개세일, 추천할인 적용 시)
  const updateProductPrices = useCallback(() => {
    // 장바구니의 기존 아이템들 가격 업데이트는 자동으로 products 상태 변경으로 반영됨
  }, []);

  // 번개세일 타이머
  useEffect(() => {
    const lightningDelay = Math.random() * 10000;

    const lightningTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProducts((prev) => {
          const availableProducts = prev.filter(
            (p) => p.availableStock > 0 && !p.onSale,
          );
          if (availableProducts.length === 0) return prev;

          const luckyProduct =
            availableProducts[
              Math.floor(Math.random() * availableProducts.length)
            ];

          alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);

          return prev.map((p) =>
            p.id === luckyProduct.id
              ? {
                  ...p,
                  val: Math.round(p.originalVal * 0.8),
                  onSale: true,
                }
              : p,
          );
        });
      }, TIMER_INTERVAL.LIGHTNING);

      return () => clearInterval(interval);
    }, lightningDelay);

    return () => clearTimeout(lightningTimer);
  }, []);

  // 추천할인 타이머
  useEffect(() => {
    const suggestDelay = Math.random() * 20000;

    const suggestTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (cartItems.length === 0 || !lastSelected) return;

        setProducts((prev) => {
          const suggestCandidates = prev.filter(
            (p) =>
              p.id !== lastSelected && p.availableStock > 0 && !p.suggestSale,
          );

          if (suggestCandidates.length === 0) return prev;

          const suggestProduct = suggestCandidates[0];

          alert(
            `💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );

          return prev.map((p) =>
            p.id === suggestProduct.id
              ? {
                  ...p,
                  val: Math.round(p.val * 0.95),
                  suggestSale: true,
                }
              : p,
          );
        });
      }, TIMER_INTERVAL.RECOMMEND);

      return () => clearInterval(interval);
    }, suggestDelay);

    return () => clearTimeout(suggestTimer);
  }, [cartItems.length, lastSelected]);

  return {
    // 상태
    products,
    cartItems,
    lastSelected,

    // 계산된 값들
    cartTotals,
    bonusPoints,
    stockWarnings,
    totalStock,

    // 액션들
    addToCart,
    updateQuantity,
    removeFromCart,
    updateProductPrices,
  };
};
