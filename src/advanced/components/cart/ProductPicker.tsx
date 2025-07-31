import { ChangeEventHandler, MouseEventHandler, useState } from 'react';

import { useCartWithProduct } from '@/hooks/useCartWithProducts';
import { useProductContext } from '@/store/ProductContext';
import { getTotalStock, isLowTotalStock, toProductOption } from '@/utils/productUtils';

const ProductPicker = () => {
  const { addToCart } = useCartWithProduct();
  const { products } = useProductContext();

  const options = products.map(toProductOption);
  const [selectedProductId, setSelectedProductId] = useState(options[0].id);

  const notifyLowTotalStock = isLowTotalStock(getTotalStock(products));

  const handleChangeValue: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const targetValue = e.target.value;
    setSelectedProductId(targetValue);
  };

  const handleClickAdd: MouseEventHandler = (e) => {
    e.preventDefault();
    addToCart(selectedProductId);
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        value={selectedProductId}
        onChange={handleChangeValue}
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        style={{
          borderColor: notifyLowTotalStock ? 'orange' : undefined,
        }}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id} disabled={option.disabled}>
            {option.message}
          </option>
        ))}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleClickAdd}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        에러 방지 노트북 파우치: 품절
      </div>
    </div>
  );
};

export default ProductPicker;
