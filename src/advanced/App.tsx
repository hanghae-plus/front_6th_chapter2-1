import { ReactElement } from 'react';

import Cart from '@/components/Cart';
import Header from '@/components/Header';
import OrderSummary from '@/components/OrderSummary';
import ProductSelector from '@/components/ProductSelector';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';

function App(): ReactElement {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCartStore();
  const { products } = useProductStore();

  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      <Header />

      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="w-1/2 flex flex-col">
          <ProductSelector products={products} onAddToCart={addToCart} />
        </div>

        <div className="w-1/2 flex flex-col">
          <Cart items={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} />
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
