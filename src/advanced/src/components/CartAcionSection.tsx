import { useState } from 'react';
import { useGlobalDispatch } from '../providers/useGlobal';
import type { Product } from '../type';
import AddToCartButton from './Button/AddToCartButton';
import ProductSelector from './ProductSelector';
import { StockStatusBox } from './StockStatusBox';

interface CartActionSectionProps {
  productList: Product[];
}

export const CartActionSection = ({ productList }: CartActionSectionProps) => {
  const dispatch = useGlobalDispatch();
  const [selectedProductId, setSelectedProductId] = useState<string>(productList[0]?.id || '');

  const handleAddButtonClick = () => {
    dispatch({ type: 'CHANGE_QUANTITY', productId: selectedProductId, delta: 1 });
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelector
        productOptions={productList}
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      />
      <AddToCartButton onClick={handleAddButtonClick} />
      <StockStatusBox productList={productList} />
    </div>
  );
};

export default CartActionSection;
