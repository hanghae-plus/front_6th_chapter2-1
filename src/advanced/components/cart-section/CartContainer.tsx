import { CartList } from './cart-list/CartList';
import { AddToCartButton } from './product-select/AddToCartButton';
import { ProductSelector } from './product-select/ProductSelector';
import { StockStatus } from './product-select/StockStatus';

export const CartContainer = () => (
  <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
    <div className='mb-6 pb-6 border-b border-gray-200'>
      <ProductSelector />
      <AddToCartButton />
      <StockStatus />
    </div>
    <CartList />
  </div>
);
