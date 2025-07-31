import { LoyaltyPointsSection } from './LoyaltyPointsSection';

interface CartTotalSectionProps {
  cartTotal: number;
  loyaltyPoints: string;
  loyaltyPointsZero: string;
}

export function CartTotalSection({
  cartTotal,
  loyaltyPoints,
  loyaltyPointsZero,
}: CartTotalSectionProps) {
  return (
    <div id="cart-total" className="pt-5 border-t border-white/10">
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">
          ₩{cartTotal.toLocaleString()}
        </div>
      </div>
      <LoyaltyPointsSection
        loyaltyPoints={loyaltyPoints}
        loyaltyPointsZero={loyaltyPointsZero}
      />
    </div>
  );
}
