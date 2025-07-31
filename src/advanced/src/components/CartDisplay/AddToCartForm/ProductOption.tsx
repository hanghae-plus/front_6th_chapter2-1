import type { Product } from '../../../services/saleService';

interface ProductOptionProps {
  product: Product;
}

export default function ProductOption({ product }: ProductOptionProps) {
  const isOutOfStock = product.quantity === 0;
  const isOnSale = product.price < product.originalPrice;

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const getOptionTextByStatus = () => {
    if (isOutOfStock) {
      return `${product.name} - ${formatPrice(product.originalPrice)} (품절)`;
    }

    if (isOnSale) {
      const discountRate = Math.round(
        (1 - product.price / product.originalPrice) * 100
      );
      return `${product.saleIcon}${product.name} - ${formatPrice(product.originalPrice)} → ${formatPrice(product.price)} (${discountRate}% SALE!)`;
    }

    return `${product.name} - ${formatPrice(product.price)}`;
  };

  const getStatusStyles = () => {
    if (isOutOfStock) return 'text-gray-400';
    if (isOnSale) return 'text-red-500 font-bold';
    return '';
  };

  return (
    <option
      value={product.id}
      disabled={isOutOfStock}
      className={getStatusStyles()}
    >
      {getOptionTextByStatus()}
    </option>
  );
}
