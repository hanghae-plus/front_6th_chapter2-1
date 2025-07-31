import React, { useEffect } from 'react';
import { Product } from '../../types';
import Select from '../common/Select';
import Button from '../common/button';
import ProductOption from './ProductOption';

interface ProductSelectorProps {
  productList?: Product[];
  onAddToCart?: () => void;
  selectedProductId?: string;
  onProductChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ProductSelector({
  productList = [],
  onAddToCart,
  selectedProductId,
  onProductChange,
}: ProductSelectorProps) {
  useEffect(() => {
    console.log(productList, 'productList..');
  }, [productList]);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <Select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProductId}
        onChange={onProductChange}
      >
        <option value="">상품을 선택해주세요</option>
        {productList && productList.length > 0 ? (
          productList.map((product) => (
            <ProductOption key={product.id} product={product} />
          ))
        ) : (
          <option value="" disabled>
            상품이 없습니다
          </option>
        )}
      </Select>
      <Button
        id="add-to-cart"
        text="Add to Cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        handleClick={onAddToCart}
        type="button"
      />
      <div
        id="stock-status"
        className="text-xs text-red-500 mt-3 whitespace-pre-line"
      ></div>
    </div>
  );
}
