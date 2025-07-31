import useDiscount from '@/advanced/hooks/useDiscount';

export default function BasicDiscount() {
  const { discountedProducts, isBulkDiscount } = useDiscount();

  if (isBulkDiscount) {
    return (
      <div className="flex justify-between text-sm tracking-wide text-green-400">
        <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span className="text-xs">-25%</span>
      </div>
    );
  }

  return discountedProducts.map(({ name, discountRate }) => (
    <div className="flex justify-between text-sm tracking-wide text-green-400">
      <span className="text-xs">{name} (10개↑)</span>
      <span className="text-xs">-{discountRate}%</span>
    </div>
  ));
}
