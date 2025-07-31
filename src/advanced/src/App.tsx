import { useEffect } from 'react';

import { CartDisplay } from './components/cart/CartDisplay';
import { Header } from './components/layout/Header';
import { SelectorContainer } from './components/layout/SelectorContainer';
import { ManualOverlay } from './components/manual/ManualOverlay';
import { ManualToggle } from './components/manual/ManualToggle';
import { RightColumn } from './components/summary/RightColumn';
import { calculateCart } from './services/CartCalculationService';
import { createLightningSaleService } from './services/LightningSaleService';
import { createPointsCalculationService } from './services/PointsCalculationService';
import { createSuggestSaleService } from './services/SuggestSaleService';
import { useCartStore, usePointsStore, useProductStore } from './store';

const App = () => {
  const {
    items,
    itemCount,
    total,
    updateTotal,
    updateItemCount,
    updateOriginalTotal,
    updateDiscountRate,
  } = useCartStore();
  const { totalPoints, pointsDetail, updateTotalPoints, updatePointsDetail } = usePointsStore();
  const { products, selectedProduct, updateProducts } = useProductStore();
  const pointsCalculationService = createPointsCalculationService();
  const lightningSaleService = createLightningSaleService(products, updateProducts);
  const suggestSaleService = createSuggestSaleService(products, selectedProduct, updateProducts);

  // 앱 초기화 시 타이머 시작
  useEffect(() => {
    lightningSaleService.startLightningSaleTimer();
    suggestSaleService.startSuggestSaleTimer();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      lightningSaleService.stopLightningSaleTimer();
      suggestSaleService.stopSuggestSaleTimer();
    };
  }, [lightningSaleService, suggestSaleService]);

  // 장바구니 변경 시 계산 수행
  useEffect(() => {
    if (items.length === 0) {
      updateTotal(0);
      updateItemCount(0);
      updateOriginalTotal(0);
      updateDiscountRate(0);
      updateTotalPoints(0);
      updatePointsDetail([]);
      return;
    }

    // 장바구니 계산
    const cartResult = calculateCart(items);
    updateTotal(cartResult.totalAmt);
    updateItemCount(cartResult.itemCnt);
    updateOriginalTotal(cartResult.originalTotal);
    updateDiscountRate(cartResult.discRate);

    // 포인트 계산
    const pointsResult = pointsCalculationService.calculateBonusPoints(items, cartResult.totalAmt);
    updateTotalPoints(pointsResult.bonusPoints);
    updatePointsDetail(pointsResult.pointsDetail);
  }, [
    items,
    updateTotal,
    updateItemCount,
    updateOriginalTotal,
    updateDiscountRate,
    updateTotalPoints,
    updatePointsDetail,
  ]);

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto flex flex-col h-screen'>
        <Header itemCount={itemCount} />
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 min-h-0'>
          <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
            <SelectorContainer />
            <CartDisplay />
          </div>
          <RightColumn total={total} bonusPoints={totalPoints} pointsDetail={pointsDetail} />
        </div>
        <ManualToggle />
        <ManualOverlay />
      </div>
    </div>
  );
};

export default App;
