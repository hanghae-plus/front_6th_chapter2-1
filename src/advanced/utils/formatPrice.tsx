import { Product } from '../types';

interface FormatPriceProps {
  product: Product;
}

export default function FormatPrice({ product }: FormatPriceProps) {
  if (product.onSale || product.suggestSale) {
    const colorClass =
      product.onSale && product.suggestSale
        ? 'text-purple-600'
        : product.onSale
          ? 'text-red-500'
          : 'text-blue-500';

    return (
      <>
        <span className="line-through text-gray-400">
          ₩{product.originalPrice?.toLocaleString()}
        </span>{' '}
        <span className={colorClass}>₩{product.price.toLocaleString()}</span>
      </>
    );
  }
  return <>₩{product.price.toLocaleString()}</>;
}
