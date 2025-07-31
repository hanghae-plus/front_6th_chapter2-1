import type { ComponentPropsWithoutRef } from 'react';
import type { Product } from '../type';

interface ProductOptionProps extends ComponentPropsWithoutRef<'option'> {
  product: Product;
}

export const ProductOption = ({ product, ...props }: ProductOptionProps) => {
  // 옵션 텍스트
  const getOptionText = () => {
    let discountText = '';

    if (product.flashSale) discountText += ' ⚡SALE';
    if (product.suggestSale) discountText += ' 💝추천';

    if (product.quantity === 0) {
      return `${product.name} - ${product.changedPrice}원 (품절)${discountText}`;
    }

    if (product.flashSale && product.suggestSale) {
      return `⚡💝${product.name} - ${product.originalPrice}원 → ${product.changedPrice}원 (25% SUPER SALE!)`;
    } else if (product.flashSale) {
      return `⚡${product.name} - ${product.originalPrice}원 → ${product.changedPrice}원 (20% SALE!)`;
    } else if (product.suggestSale) {
      return `💝${product.name} - ${product.originalPrice}원 → ${product.changedPrice}원 (5% 추천할인!)`;
    } else {
      return `${product.name} - ${product.changedPrice}원${discountText}`;
    }
  };

  // 옵션 스타일
  const getOptionStyle = () => {
    if (product.quantity === 0) return 'text-gray-400';

    if (product.flashSale && product.suggestSale) {
      return 'text-purple-600 font-bold';
    } else if (product.flashSale) {
      return 'text-red-500 font-bold';
    } else if (product.suggestSale) {
      return 'text-blue-500 font-bold';
    }
    return '';
  };

  return (
    <option className={getOptionStyle()} disabled={product.quantity === 0} {...props}>
      {getOptionText()}
    </option>
  );
};

export default ProductOption;
