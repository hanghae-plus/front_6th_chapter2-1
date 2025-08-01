import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCT_IDS } from '../constants/product';
import { getIsTuesday } from '../utils/date';
import { setupIntervalEvent } from '../utils/intervalEvent';
import { getLightningSaleProduct, findRecommendedProduct } from '../utils/product';
import { calculateCartTotals, calculateBonusPoints } from '../utils/cart';
import Header from './Header';
import ProductSelector from './ProductSelector';
import CartItems from './CartItems';
import OrderSummary from './OrderSummary';
import HelpModal from './HelpModal';

const initialProductList: Product[] = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.POUCH,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    isOnSale: false,
    isRecommended: false,
  },
];

interface CartItem {
  productId: string;
  quantity: number;
}

const App: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const isTuesday = getIsTuesday();

  // 장바구니 계산
  const cartTotals = calculateCartTotals(cartItems, productList);
  const { totalItemCount, subTotalBeforeDiscount, subTotalAfterDiscount } = cartTotals;

  // 화요일 할인 적용
  let finalSubTotal = subTotalAfterDiscount;
  if (isTuesday) {
    finalSubTotal = subTotalAfterDiscount * 0.9;
  }

  // 30개 이상 할인 적용
  if (totalItemCount >= 30) {
    finalSubTotal = subTotalBeforeDiscount * 0.75;
    if (isTuesday) {
      finalSubTotal *= 0.9;
    }
  }

  const discountRate = 1 - finalSubTotal / subTotalBeforeDiscount;

  // 포인트 계산
  const bonusPoints = calculateBonusPoints({
    cartItems,
    productList,
    totalItemCount,
    subTotalAfterDiscount: finalSubTotal,
    isTuesday,
  });

  // 상품 추가
  const handleAddToCart = (productId: string) => {
    const product = productList.find((p) => p.id === productId);
    if (!product || product.quantity === 0) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });

    // 재고 감소
    setProductList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p)),
    );

    setSelectedProductId(productId);
  };

  // 수량 변경
  const handleQuantityChange = (productId: string, change: number) => {
    const product = productList.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      if (!existingItem) return prev;

      const newQuantity = existingItem.quantity + change;
      if (newQuantity <= 0) {
        // 상품 제거
        setProductList((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity + existingItem.quantity } : p,
          ),
        );
        return prev.filter((item) => item.productId !== productId);
      }

      // 재고 확인
      if (change > 0 && product.quantity < change) {
        alert('재고가 부족합니다.');
        return prev;
      }

      // 재고 업데이트
      setProductList((prevProducts) =>
        prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - change } : p)),
      );

      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item,
      );
    });
  };

  // 상품 제거
  const handleRemoveProduct = (productId: string) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!cartItem) return;

    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    setProductList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + cartItem.quantity } : p,
      ),
    );
  };

  // 번개세일 설정
  useEffect(() => {
    const applyLightningSale = () => {
      const product = getLightningSaleProduct(productList);
      if (!product) return;

      setProductList((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                price: Math.round((p.originalPrice * 80) / 100),
                isOnSale: true,
              }
            : p,
        ),
      );

      alert(`⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
    };

    setupIntervalEvent({
      action: applyLightningSale,
      delay: Math.random() * 10000,
      interval: 30000,
    });
  }, [productList]);

  // 추천할인 설정
  useEffect(() => {
    const applyRecommendationDiscount = () => {
      const product = findRecommendedProduct(productList, selectedProductId || '');
      if (!product) return;

      setProductList((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                price: Math.round((p.price * 95) / 100),
                isRecommended: true,
              }
            : p,
        ),
      );

      alert(`💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    };

    setupIntervalEvent({
      action: applyRecommendationDiscount,
      delay: 20000,
      interval: 60000,
    });
  }, [productList, selectedProductId]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <Header itemCount={totalItemCount} />

        <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6'>
          <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
            <ProductSelector productList={productList} onAddToCart={handleAddToCart} />
            <CartItems
              cartItems={cartItems}
              productList={productList}
              onQuantityChange={handleQuantityChange}
              onRemoveProduct={handleRemoveProduct}
            />
          </div>

          <OrderSummary
            cartItems={cartItems}
            productList={productList}
            totalItemCount={totalItemCount}
            subTotalBeforeDiscount={subTotalBeforeDiscount}
            subTotalAfterDiscount={finalSubTotal}
            discountRate={discountRate}
            isTuesday={isTuesday}
            bonusPoints={bonusPoints}
          />
        </div>
      </div>

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />

      <button
        onClick={() => setIsHelpModalOpen(true)}
        className='fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default App;
