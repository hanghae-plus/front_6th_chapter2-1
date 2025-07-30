export default function CartDisplay() {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <div className="mb-6 pb-6 border-b border-gray-200">
        <select
          id="product-select"
          className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        >
          <option value="p1" className="text-red-500 font-bold">
            ⚡버그 없애는 키보드 - 10000원 → 8000원 (20% SALE!)
          </option>
          <option value="p2" className="text-purple-600 font-bold">
            ⚡💝생산성 폭발 마우스 - 20000원 → 15200원 (25% SUPER SALE!)
          </option>
          <option value="p3" className="text-purple-600 font-bold">
            ⚡💝거북목 탈출 모니터암 - 30000원 → 22800원 (25% SUPER SALE!)
          </option>
          <option value="p4" disabled className="text-gray-400">
            에러 방지 노트북 파우치 - 15000원 (품절)
          </option>
          <option value="p5" className="text-purple-600 font-bold">
            ⚡💝코딩할 때 듣는 Lo-Fi 스피커 - 25000원 → 19000원 (25% SUPER
            SALE!)
          </option>
        </select>
        <button
          id="add-to-cart"
          className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        >
          Add to Cart
        </button>
        <div
          id="stock-status"
          className="text-xs text-red-500 mt-3 whitespace-pre-line"
        >
          에러 방지 노트북 파우치: 품절
        </div>
      </div>
      <div id="cart-items">
        <div
          id="p2"
          className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div>
            <h3 className="text-base font-normal mb-1 tracking-tight">
              ⚡💝생산성 폭발 마우스
            </h3>
            <p className="text-xs text-gray-500 mb-0.5 tracking-wide">
              PRODUCT
            </p>
            <p className="text-xs text-black mb-3">
              <span className="line-through text-gray-400">₩20,000</span>{' '}
              <span className="text-red-500">₩16,000</span>
            </p>
            <div className="flex items-center gap-4">
              <button
                className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                data-product-id="p2"
                data-change="-1"
              >
                −
              </button>
              <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
                5
              </span>
              <button
                className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                data-product-id="p2"
                data-change="1"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-lg mb-2 tracking-tight tabular-nums"
              style={{ fontWeight: 'normal' }}
            >
              <span className="line-through text-gray-400">₩20,000</span>{' '}
              <span className="text-purple-600">₩15,200</span>
            </div>
            <a
              className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
              data-product-id="p2"
            >
              Remove
            </a>
          </div>
        </div>
        <div
          id="p1"
          className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div>
            <h3 className="text-base font-normal mb-1 tracking-tight">
              ⚡버그 없애는 키보드
            </h3>
            <p className="text-xs text-gray-500 mb-0.5 tracking-wide">
              PRODUCT
            </p>
            <p className="text-xs text-black mb-3">
              <span className="line-through text-gray-400">₩10,000</span>{' '}
              <span className="text-red-500">₩8,000</span>
            </p>
            <div className="flex items-center gap-4">
              <button
                className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                data-product-id="p1"
                data-change="-1"
              >
                −
              </button>
              <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
                1
              </span>
              <button
                className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                data-product-id="p1"
                data-change="1"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-lg mb-2 tracking-tight tabular-nums"
              style={{ fontWeight: 'normal' }}
            >
              <span className="line-through text-gray-400">₩10,000</span>{' '}
              <span className="text-red-500">₩8,000</span>
            </div>
            <a
              className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
              data-product-id="p1"
            >
              Remove
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
