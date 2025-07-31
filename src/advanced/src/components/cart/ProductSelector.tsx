import type { Product } from "../../constants";
import { createOption } from "../../utils/optionUtils";

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
  stockStatus: string;
}

export const ProductSelector = ({
  products,
  selectedProduct,
  onProductSelect,
  onAddToCart,
  stockStatus,
}: ProductSelectorProps) => {
  // 선택된 상품 정보
  const selectedProductInfo = products.find((p) => p.id === selectedProduct);
  const isProductSelected = selectedProduct && selectedProductInfo;
  const isProductOutOfStock = selectedProductInfo?.quantity === 0;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        value={selectedProduct}
        onChange={(e) => onProductSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        {products.map((product) => {
          const optionData = createOption(product);
          return (
            <option
              key={product.id}
              value={product.id}
              disabled={optionData.disabled}
              className={optionData.className}
            >
              {optionData.text}
            </option>
          );
        })}
      </select>

      <button
        onClick={onAddToCart}
        disabled={!isProductSelected || isProductOutOfStock}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {!isProductSelected
          ? "상품을 선택하세요"
          : isProductOutOfStock
            ? "품절"
            : "Add to Cart"}
      </button>

      {stockStatus && (
        <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
          {stockStatus}
        </div>
      )}
    </div>
  );
};
