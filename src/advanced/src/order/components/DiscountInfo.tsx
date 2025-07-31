interface DiscountInfoProps {
  discountInfo: string;
}

export function DiscountInfo({ discountInfo }: DiscountInfoProps) {
  return (
    <div id="discount-info" className="mb-4 text-white/50">
      {discountInfo}
    </div>
  );
}
