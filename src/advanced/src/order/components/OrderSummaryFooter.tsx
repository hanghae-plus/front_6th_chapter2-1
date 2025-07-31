import { DiscountInfo } from './DiscountInfo';
import { CartTotalSection } from './CartTotalSection';
import { TuesdaySpecialSection } from './TuesdaySpecialSection';

interface OrderSummaryFooterProps {
  discountInfo: string;
  cartTotal: number;
  loyaltyPoints: string;
  loyaltyPointsZero: string;
  isCurrentlyTuesday: boolean;
}

export function OrderSummaryFooter({
  discountInfo,
  cartTotal,
  loyaltyPoints,
  loyaltyPointsZero,
  isCurrentlyTuesday,
}: OrderSummaryFooterProps) {
  return (
    <div className="mt-auto">
      <DiscountInfo discountInfo={discountInfo} />
      <CartTotalSection
        cartTotal={cartTotal}
        loyaltyPoints={loyaltyPoints}
        loyaltyPointsZero={loyaltyPointsZero}
      />
      <TuesdaySpecialSection isCurrentlyTuesday={isCurrentlyTuesday} />
    </div>
  );
}
