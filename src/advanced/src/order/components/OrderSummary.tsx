import { useCart } from 'cart/context';
import { useOrderSummary } from 'order/hooks';
import { UI_TEXTS } from '@shared/constants/event';
import {
  OrderSummaryHeader,
  SummaryDetails,
  OrderSummaryFooter,
  CheckoutButton,
  ShippingNotice,
} from './index';

export function OrderSummary() {
  const {
    cartItems,
    cartTotal,
    discountInfo,
    loyaltyPoints: calculatedPoints,
  } = useCart();
  const {
    subtotal,
    isCurrentlyTuesday,
    itemDiscounts,
    showBulkDiscount,
    showIndividualDiscounts,
    showTuesdayDiscount,
  } = useOrderSummary();

  const { loyaltyPoints: loyaltyPointsTemplate, loyaltyPointsZero } = UI_TEXTS;

  // 실제 계산된 포인트로 템플릿 치환
  const loyaltyPoints =
    calculatedPoints > 0
      ? loyaltyPointsTemplate.replace('{points}', calculatedPoints.toString())
      : loyaltyPointsZero.replace('{points}', '0');

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <OrderSummaryHeader />
      <div className="flex-1 flex flex-col">
        <SummaryDetails
          cartItems={cartItems}
          subtotal={subtotal}
          showBulkDiscount={showBulkDiscount}
          showIndividualDiscounts={showIndividualDiscounts}
          itemDiscounts={itemDiscounts}
          showTuesdayDiscount={showTuesdayDiscount}
        />
        <OrderSummaryFooter
          discountInfo={discountInfo}
          cartTotal={cartTotal}
          loyaltyPoints={loyaltyPoints}
          loyaltyPointsZero={loyaltyPointsZero}
          isCurrentlyTuesday={isCurrentlyTuesday}
        />
      </div>
      <CheckoutButton />
      <ShippingNotice />
    </div>
  );
}
