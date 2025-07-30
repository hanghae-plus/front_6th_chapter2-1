export default function AddToCartSection() {
  return (
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
          ⚡💝코딩할 때 듣는 Lo-Fi 스피커 - 25000원 → 19000원 (25% SUPER SALE!)
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
  );
}
