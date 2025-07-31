interface IndividualDiscountsSectionProps {
  showIndividualDiscounts: boolean;
  itemDiscounts: Array<{ name: string; discount: number }>;
}

export function IndividualDiscountsSection({
  showIndividualDiscounts,
  itemDiscounts,
}: IndividualDiscountsSectionProps) {
  if (!showIndividualDiscounts) return null;

  return (
    <>
      {itemDiscounts.map((item, index) => (
        <div
          key={index}
          className="flex justify-between text-sm tracking-wide text-green-400"
        >
          <span className="text-xs">{item.name} (10개↑)</span>
          <span className="text-xs">-{item.discount}%</span>
        </div>
      ))}
    </>
  );
}
