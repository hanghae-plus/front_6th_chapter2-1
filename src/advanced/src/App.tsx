import { useEffect } from 'react';
import { useCartStore, usePointsStore } from './store';
import { Header } from './components/layout/Header';
import { GridContainer } from './components/layout/GridContainer';
import { ManualToggle } from './components/manual/ManualToggle';
import { ManualOverlay } from './components/manual/ManualOverlay';
import { calculateCart } from './services/CartCalculationService';
import { createPointsCalculationService } from './services/PointsCalculationService';

const App = () => {
  const { items, itemCount, updateTotal, updateItemCount, updateOriginalTotal, updateDiscountRate } = useCartStore();
  const { updateTotalPoints, updatePointsDetail } = usePointsStore();
  const pointsCalculationService = createPointsCalculationService();

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
  }, [items, updateTotal, updateItemCount, updateOriginalTotal, updateDiscountRate, updateTotalPoints, updatePointsDetail]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Header itemCount={itemCount} />
        <GridContainer 
          total={items.length > 0 ? items.reduce((sum, item) => sum + (item.val * item.quantity), 0) : 0}
          bonusPoints={0}
          pointsDetail={[]}
        />
        <ManualToggle />
        <ManualOverlay />
      </div>
    </div>
  );
};

export default App;
