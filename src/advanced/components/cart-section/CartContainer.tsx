import { CartList } from './cart-list/CartList';
import { ProductSelection } from './product-select/ProductSelection';
import { StockStatus } from './product-select/StockStatus';

export const CartContainer = () => (
  <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
    <div className='mb-6 pb-6 border-b border-gray-200'>
      <ProductSelection />
      <StockStatus />
    </div>
    <CartList />
  </div>
);
