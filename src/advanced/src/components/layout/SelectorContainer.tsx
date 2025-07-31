import { AddToCartButton } from '../cart/AddToCartButton';
import { ProductSelector } from '../product/ProductSelector';
import { StockInfo } from '../product/StockInfo';

export const SelectorContainer = () => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelector />
      <AddToCartButton />
      <StockInfo />
    </div>
  );
}; 