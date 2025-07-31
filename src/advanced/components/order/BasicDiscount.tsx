import useDiscount from '@/advanced/hooks/useDiscount';
import { useProductStore } from '@/advanced/store';
import { getBasicDiscountRate } from '@/advanced/utils/discount.util';

export default function BasicDiscount() {
  const { products } = useProductStore();
  const { basicDiscountedProducts, isBulkDiscount } = useDiscount();

  if (isBulkDiscount) {
    return (
      <div className="flex justify-between text-sm tracking-wide text-green-400">
        <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span className="text-xs">-25%</span>
      </div>
    );
  }

  return basicDiscountedProducts.map(id => {
    const product = products.find(product => product.id === id);

    if (!product) return null;

    return (
      <div className="flex justify-between text-sm tracking-wide text-green-400">
        <span className="text-xs">{product.name} (10개↑)</span>
        <span className="text-xs">-{getBasicDiscountRate(product.id)}%</span>
      </div>
    );
  });
}
