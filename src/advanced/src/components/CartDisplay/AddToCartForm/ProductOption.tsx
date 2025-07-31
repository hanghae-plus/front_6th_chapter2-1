import type { Product } from '../../../services/saleService';

interface ProductOptionProps {
  product: Product;
}

export default function ProductOption({ product }: ProductOptionProps) {
  const formatProductOption = (product: Product) => {
    const hasDiscount = product.price < product.originalPrice;
    const discountRate = hasDiscount
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

    if (product.quantity === 0) {
      return `${product.name} - ₩${product.originalPrice.toLocaleString()} (품절)`;
    }

    if (hasDiscount) {
      return `${product.saleIcon}${product.name} - ₩${product.originalPrice.toLocaleString()} → ₩${product.price.toLocaleString()} (${discountRate}% SALE!)`;
    }

    return `${product.name} - ₩${product.price.toLocaleString()}`;
  };

  return (
    <option
      value={product.id}
      disabled={product.quantity === 0}
      className={
        product.quantity === 0
          ? 'text-gray-400'
          : product.price < product.originalPrice
            ? 'text-red-500 font-bold'
            : ''
      }
    >
      {formatProductOption(product)}
    </option>
  );
}