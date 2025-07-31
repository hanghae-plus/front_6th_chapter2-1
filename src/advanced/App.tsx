import { useState } from 'react';
import { Header } from './shared/components/Header.tsx';
import HelpModal from './shared/components/HelpModal.tsx';
import ProductSelector from './features/product/components/ProductSelector.tsx';
import { ELEMENT_IDS } from './shared/constants/elementIds.ts';
import { initialProducts } from './features/product/constants/index.ts';

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemCount, setItemCount] = useState(0);

  const handleProductSelection = (productId: string) => {
    setSelectedProductId(productId);
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
            >
              Add to Cart
            </button>
            <div
              id={ELEMENT_IDS.STOCK_STATUS}
              className='text-xs text-red-500 mt-3 whitespace-pre-line'
            ></div>
          </div>
          <div id={ELEMENT_IDS.CART_ITEMS} className='space-y-3'></div>
        </div>

        {/* Right Column */}
        <div className='bg-black text-white p-8 flex flex-col'>
          <h2 className='text-xs font-medium mb-5 tracking-extra-wide uppercase'>
            Order Summary
          </h2>
          <div className='flex-1 flex flex-col'>
            <div id='summary-details' className='space-y-3'></div>
            <div className='mt-auto'>
              <div id='discount-info' className='mb-4'></div>
              <div id='cart-total' className='pt-5 border-t border-white/10'>
                <div className='flex justify-between items-baseline'>
                  <span className='text-sm uppercase tracking-wider'>
                    Total
                  </span>
                  <div id='total-amount' className='text-2xl tracking-tight'>
                    ₩0
                  </div>
                </div>
                <div
                  id='loyalty-points'
                  className='text-xs text-blue-400 mt-2 text-right'
                >
                  적립 포인트: 0p
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
