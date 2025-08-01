import { CartContainer } from './CartContainer';
import { ProductSelector } from './ProductSelector';

export const LeftColumn = () => (
  <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
    <ProductSelector />
    <CartContainer />
  </div>
);
