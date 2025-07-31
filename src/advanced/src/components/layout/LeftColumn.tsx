import { SelectorContainer } from './SelectorContainer';
import { CartDisplay } from '../cart/CartDisplay';

export const LeftColumn = () => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <SelectorContainer />
      <CartDisplay />
    </div>
  );
}; 