import ProductPicker from './ProductPicker';

const ShoppingCart = () => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker />
      <div
        id="cart-items"
        className="grid grid-cols-[80px_1fr_auto] gap-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
      >
        <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
        </div>
        <div>
          <h3 className="text-base font-normal mb-1 tracking-tight">빅이 없에는 키보드</h3>
          <p className="text-xs text-gray-500 mb-0.5 tracking-wide">Product</p>
          <p className="text-xs text-black mb-3">₩10,000</p>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="p1"
            data-change="-1"
          >
            -
          </button>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="p1"
            data-change="1"
          >
            +
          </button>
        </div>
        <div className="flex flex-col text-right">
          <div className="text-right">
            <span className="text-lg mb-2 tracking-tight tabular-nums">
              <span className="line-through text-gray-400">₩10,000</span>
              <span>₩7,600</span>
            </span>
          </div>
          <a
            className="remove-item text-xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-b-transparent hover:text-black hover:border-black"
            data-product-id="p1"
          >
            Remove
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
