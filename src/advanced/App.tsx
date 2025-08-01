import Header from '@advanced/components/Header';

const App = () => {
  return (
    <>
      <Header />
      {/* gridContainer */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        {/* leftColumn */}
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          {/* selectorContainer */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
              id="product-select"
            ></select>
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
