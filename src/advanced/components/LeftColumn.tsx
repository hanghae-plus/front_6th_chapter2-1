import { CartList } from './CartList';
import { SelectorContainer } from './SelectorContainer';

export function LeftColumn() {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <SelectorContainer />
      <CartList />
    </div>
  );
}
