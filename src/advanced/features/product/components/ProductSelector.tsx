import React from 'react';
import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';

interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

interface ProductSelectorProps {
  products?: Product[];
  selectedProductId?: string;
  onSelectionChange?: (productId: string) => void;
}

const ProductSelector = ({
  products = [],
  selectedProductId = '',
  onSelectionChange,
}: ProductSelectorProps) => {
  // 할인 표시 텍스트 생성 함수
  const createDiscountText = (product: Product): string => {
    const { DISCOUNT } = BUSINESS_CONSTANTS;

    if (product.q === 0) {
      return `${product.name} - ${product.val}원 (품절)`;
    }

    if (product.onSale && product.suggestSale) {
      const superSaleRate =
        (DISCOUNT.FLASH_SALE_DISCOUNT_RATE + DISCOUNT.SUGGEST_DISCOUNT_RATE) *
        100;
      return `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${superSaleRate}% SUPER SALE!)`;
    }

    if (product.onSale) {
      const flashSaleRate = DISCOUNT.FLASH_SALE_DISCOUNT_RATE * 100;
      return `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (${flashSaleRate}% SALE!)`;
    }

    if (product.suggestSale) {
      const suggestRate = DISCOUNT.SUGGEST_DISCOUNT_RATE * 100;
      return `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${suggestRate}% 추천할인!)`;
    }

    return `${product.name} - ${product.val}원`;
  };

  // 할인 표시 클래스 생성 함수
  const createDiscountClass = (product: Product): string => {
    if (product.q === 0) {
      return 'text-gray-400';
    }

    if (product.onSale && product.suggestSale) {
      return 'text-purple-600 font-bold';
    }

    if (product.onSale) {
      return 'text-red-500 font-bold';
    }

    if (product.suggestSale) {
      return 'text-blue-500 font-bold';
    }

    return '';
  };

  // 선택 변경 핸들러
  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (onSelectionChange) {
      onSelectionChange(event.target.value);
    }
  };

  return (
    <select
      id='product-select'
      className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
      value={selectedProductId}
      onChange={handleSelectionChange}
    >
      {products.map(product => (
        <option
          key={product.id}
          value={product.id}
          disabled={product.q === 0}
          className={createDiscountClass(product)}
        >
          {createDiscountText(product)}
        </option>
      ))}
    </select>
  );
};

export default ProductSelector;
