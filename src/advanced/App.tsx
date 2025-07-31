import { useState } from 'react';
import { Header } from './shared/components/Header.tsx';
import HelpModal from './shared/components/HelpModal.tsx';
import ProductSelector from './features/product/components/ProductSelector.tsx';
import CartItem from './features/cart/components/CartItem.tsx';
import OrderSummaryDetails from './features/order/components/OrderSummaryDetails.tsx';
import { ELEMENT_IDS } from './shared/constants/elementIds.ts';
import { initialProducts } from './features/product/constants/index.ts';
import { useCartStore } from './features/cart/store/cartStore.ts';

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState(
    initialProducts[0]?.id || '',
  );

  const { cartItems, itemCount, addItem, removeItem, updateQuantity } =
    useCartStore();

  const handleProductSelection = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct || selectedProduct.q <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    const existingItem = cartItems.find(item => item.id === selectedProductId);

    if (existingItem) {
      if (existingItem.quantity >= selectedProduct.q) {
        alert('재고가 부족합니다.');
        return;
      }
    }

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      val: selectedProduct.val,
      originalVal: selectedProduct.originalVal,
      onSale: selectedProduct.onSale,
      suggestSale: selectedProduct.suggestSale,
    });

    setProducts(prev =>
      prev.map(p => (p.id === selectedProductId ? { ...p, q: p.q - 1 } : p)),
    );
  };

  const handleQuantityChange = (id: string, change: number) => {
    const product = products.find(p => p.id === id);
    const cartItem = cartItems.find(item => item.id === id);

    if (!product || !cartItem) return;

    const newQuantity = cartItem.quantity + change;

    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    if (change > 0 && product.q <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    updateQuantity(id, newQuantity);

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, q: p.q - change } : p)),
    );
  };

  const handleRemoveItem = (id: string) => {
    const cartItem = cartItems.find(item => item.id === id);
    if (!cartItem) return;

    removeItem(id);

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, q: p.q + cartItem.quantity } : p)),
    );
  };

  const summaryData = {
    cartItems: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.val,
    })),
    subtotal: cartItems.reduce(
      (sum, item) => sum + item.val * item.quantity,
      0,
    ),
    itemCount,
    isTuesday: new Date().getDay() === 2,
    hasBulkDiscount: itemCount >= 30,
  };

  return (
    <>
      <Header itemCount={itemCount} />

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden'>
        {/* Left Column */}
        <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
          <div className='mb-6 pb-6 border-b border-gray-200'>
            <ProductSelector
              products={products}
              selectedProductId={selectedProductId}
              onSelectionChange={handleProductSelection}
            />
            <button
              id={ELEMENT_IDS.ADD_TO_CART}
              className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <div
              id={ELEMENT_IDS.STOCK_STATUS}
              className='text-xs text-red-500 mt-3 whitespace-pre-line'
            ></div>
          </div>

          <div id={ELEMENT_IDS.CART_ITEMS} className='space-y-3'>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                val={item.val}
                originalVal={item.originalVal}
                quantity={item.quantity}
                onSale={item.onSale}
                suggestSale={item.suggestSale}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className='bg-black text-white p-8 flex flex-col'>
          <h2 className='text-xs font-medium mb-5 tracking-extra-wide uppercase'>
            Order Summary
          </h2>
          <div className='flex-1 flex flex-col'>
            <OrderSummaryDetails {...summaryData} />
            <div className='mt-auto'>
              <div id='discount-info' className='mb-4'></div>
              <div id='cart-total' className='pt-5 border-t border-white/10'>
                <div className='flex justify-between items-baseline'>
                  <span className='text-sm uppercase tracking-wider'>
                    Total
                  </span>
                  <div id='total-amount' className='text-2xl tracking-tight'>
                    ₩
                    {cartItems
                      .reduce((sum, item) => sum + item.val * item.quantity, 0)
                      .toLocaleString()}
                  </div>
                </div>
                <div
                  id='loyalty-points'
                  className='text-xs text-blue-400 mt-2 text-right'
                >
                  적립 포인트:{' '}
                  {Math.floor(
                    cartItems.reduce(
                      (sum, item) => sum + item.val * item.quantity,
                      0,
                    ) / 1000,
                  )}
                  p
                </div>
              </div>
              <div
                id='tuesday-special'
                className='mt-4 p-3 bg-white/10 rounded-lg hidden'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-2xs'>🎉</span>
                  <span className='text-xs uppercase tracking-wide'>
                    Tuesday Special 10% Applied
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className='w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'>
            Proceed to Checkout
          </button>
          <p className='mt-4 text-2xs text-white/60 text-center leading-relaxed'>
            Free shipping on all orders.
            <br />
            <span id='points-notice'>Earn loyalty points with purchase.</span>
          </p>
        </div>
      </div>

      <HelpModal />
    </>
  );
}

export default App;
