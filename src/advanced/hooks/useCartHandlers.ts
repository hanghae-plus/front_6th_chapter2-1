// ==========================================
// 장바구니 핸들러 훅
// ==========================================

import { useState, useCallback } from 'react';
import type { Product } from '../types';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  val: number;
  originalVal: number;
  onSale: boolean;
  suggestSale: boolean;
}

export function useCartHandlers(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stockInfo, setStockInfo] = useState('');

  // 상품 선택 핸들러
  const handleProductChange = useCallback((productId: string) => {
    setSelectedProduct(productId);
    const product = products.find(p => p.id === productId);
    if (product && product.quantity === 0) {
      setStockInfo('⚠️ 품절된 상품입니다.');
    } else {
      setStockInfo('');
    }
  }, [products]);

  // 장바구니 추가 핸들러 (기존 EventHandlers.js 로직 기반)
  const handleAddToCart = useCallback(() => {
    if (!selectedProduct) {
      alert('상품을 선택해주세요.');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      return;
    }

    if (product.quantity <= 0) {
      alert('품절된 상품입니다.');
      return;
    }

    // 이미 장바구니에 있는 아이템인지 확인
    const existingItem = cartItems.find(item => item.id === selectedProduct);
    
    if (existingItem) {
      // 기존 아이템 수량 증가
      const newQty = existingItem.quantity + 1;
      if (newQty <= product.quantity + existingItem.quantity) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === selectedProduct
              ? { ...item, quantity: newQty }
              : item
          )
        );
        // 재고 감소
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === selectedProduct
              ? { ...p, quantity: p.quantity - 1 }
              : p
          )
        );
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새로운 아이템 추가
      const newCartItem = {
        id: product.id,
        name: product.name,
        quantity: 1,
        val: product.val,
        originalVal: product.originalVal,
        onSale: product.onSale,
        suggestSale: product.suggestSale
      };
      
      setCartItems(prevItems => [...prevItems, newCartItem]);
      
      // 재고 감소
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === selectedProduct
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
      );
    }
  }, [selectedProduct, products, cartItems, setProducts, setCartItems]);

  // 수량 변경 핸들러 (기존 EventHandlers.js 로직 기반)
  const handleQuantityChange = useCallback((productId: string, change: number) => {
    const cartItem = cartItems.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!cartItem || !product) return;

    const currentQty = cartItem.quantity;
    const newQty = currentQty + change;

    // 수량이 0 이하가 되면 아이템 제거
    if (newQty <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      // 재고 복원
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId
            ? { ...p, quantity: p.quantity + currentQty }
            : p
        )
      );
      return;
    }

    // 재고 확인 (증가하는 경우)
    if (change > 0 && product.quantity < change) {
      alert('재고가 부족합니다.');
      return;
    }

    // 수량 변경 적용
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    // 재고 조정
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, quantity: p.quantity - change }
          : p
      )
    );
  }, [cartItems, products, setCartItems, setProducts]);

  // 아이템 제거 핸들러 (기존 EventHandlers.js 로직 기반)
  const handleRemoveItem = useCallback((productId: string) => {
    const cartItem = cartItems.find(item => item.id === productId);
    if (!cartItem) return;

    // 장바구니에서 제거
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // 재고 복원
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, quantity: p.quantity + cartItem.quantity }
          : p
      )
    );
  }, [cartItems, setCartItems, setProducts]);

  const handleCheckout = useCallback(() => {
    alert('결제 페이지로 이동합니다!');
  }, []);

  return {
    selectedProduct,
    stockInfo,
    handleProductChange,
    handleAddToCart,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout
  };
}