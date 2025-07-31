import { ProductItemsList } from './ProductItemsList';
import { SubtotalSection } from './SubtotalSection';
import { BulkDiscountSection } from './BulkDiscountSection';
import { IndividualDiscountsSection } from './IndividualDiscountsSection';
import { TuesdayDiscountSection } from './TuesdayDiscountSection';

interface SummaryDetailsProps {
  cartItems: Array<{ product: any; quantity: number }>;
  subtotal: number;
  showBulkDiscount: boolean;
  showIndividualDiscounts: boolean;
  itemDiscounts: Array<{ name: string; discount: number }>;
  showTuesdayDiscount: boolean;
}

export function SummaryDetails({
  cartItems,
  subtotal,
  showBulkDiscount,
  showIndividualDiscounts,
  itemDiscounts,
  showTuesdayDiscount,
}: SummaryDetailsProps) {
  return (
    <div id="summary-details" className="space-y-3">
      <ProductItemsList cartItems={cartItems} />
      <SubtotalSection subtotal={subtotal} />
      <BulkDiscountSection showBulkDiscount={showBulkDiscount} />
      <IndividualDiscountsSection
        showIndividualDiscounts={showIndividualDiscounts}
        itemDiscounts={itemDiscounts}
      />
      <TuesdayDiscountSection showTuesdayDiscount={showTuesdayDiscount} />
    </div>
  );
}
