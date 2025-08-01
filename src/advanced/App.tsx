import Header from '@advanced/components/Header';
import ProductSelector from '@advanced/components/ProductSelector';
import { productList } from '@advanced/feature/product/constant';
import { type ChangeEvent, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState(productList);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <>
      <Header />
      {/* gridContainer */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        {/* leftColumn */}
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          {/* selectorContainer */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <ProductSelector products={products} value={selectedProduct} onChange={handleSelectProduct} />
            <button
              className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
              id="add-to-cart"
            >
              Add to Cart
            </button>
            <div className="text-xs text-red-500 mt-3 whitespace-pre-line" id="stock-status"></div>
          </div>
          {/* cartContainerEl */}
          <div id="cart-items"></div>
        </div>
        {/* rightColumn */}
        <div className="bg-black text-white p-8 flex flex-col"></div>
      </div>
    </>
  );
};

export default App;
