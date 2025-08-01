import React from 'react';
import { CartItem as CartItemType } from '../../../types';
import { useTimer } from '../../../contexts/TimerContext';
import { calculateCartSummary } from '../../../services/cartService';
import { CURRENCY_SYMBOL } from '../../../constants';
import DiscountSection from './DiscountSection';

interface OrderSummaryProps {
  cartItems: ReadonlyArray<CartItemType>;
}

interface SummaryItemOptions {
  isHighlighted?: boolean;
  isTotal?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const { timerState } = useTimer();

  const renderTuesdayBanner = (): React.ReactElement | null => {
    const isTuesday = new Date().getDay() === 2;
    if (!isTuesday) return null;

    return (
      <div className="mb-4 p-3 bg-orange-600 rounded-lg text-center">
        <p className="font-semibold">🗓️ 화요일 특별 할인 10% 적용 중!</p>
      </div>
    );
  };

  const renderSummaryItem = (
    label: string,
    value: string | number,
    options?: SummaryItemOptions
  ): React.ReactElement => {
    const textColor = options?.isHighlighted ? 'text-green-400' : 'text-white';
    const textSize = options?.isTotal ? 'text-lg font-semibold' : 'text-base';

    return (
      <div className={`flex justify-between ${textSize}`}>
        <span>{label}:</span>
        <span className={textColor}>
          {typeof value === 'number'
            ? `${CURRENCY_SYMBOL}${value.toLocaleString()}`
            : value}
        </span>
      </div>
    );
  };

  const cartSummary = calculateCartSummary(
    cartItems,
    timerState.flashSaleProductId,
    timerState.recommendationProductId
  );

  return (
    <div className="bg-black text-white p-6 rounded-lg sticky top-4">
      <h2 className="text-2xl font-semibold mb-6">주문 요약</h2>

      {renderTuesdayBanner()}

      <div className="space-y-4">
        {renderSummaryItem('소계', cartSummary.subtotal)}

        <DiscountSection
          itemDiscounts={cartSummary.discountData.itemDiscounts}
          finalPoints={cartSummary.loyaltyPoints.finalPoints}
          pointsDetail={cartSummary.loyaltyPoints.pointsDetail}
          hasItems={cartItems.length > 0}
        />

        {renderSummaryItem('배송비', '무료', { isHighlighted: true })}

        <hr className="border-gray-600" />

        {renderSummaryItem('총 금액', cartSummary.discountData.totalAmount, {
          isTotal: true,
        })}

        <button className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
          결제하기
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          * 할인은 자동으로 적용됩니다
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
