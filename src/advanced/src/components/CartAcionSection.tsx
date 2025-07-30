import type { Product } from '../type';
import AddToCartButton from './Button/AddToCartButton';
import ProductSelector from './ProductSelector';
import { StockStatusBox } from './StockStatusBox';

interface CartActionSectionProps {
  productList: Product[];
}

// = selectorContainer
export const CartActionSection = ({ productList }: CartActionSectionProps) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelector productOptions={productList} />
      <AddToCartButton />
      <StockStatusBox productList={productList} />
    </div>
  );
};

export default CartActionSection;
