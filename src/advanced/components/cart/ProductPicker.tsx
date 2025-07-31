import { Product } from '@/types/index';

interface ProductPickerProps {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
  stockInfoMessage: string;
  totalStockQuantity: number;
}

const ProductPicker = ({
  products,
  selectedProductId,
  onProductSelect,
  onAddToCart,
  stockInfoMessage,
  totalStockQuantity,
}: ProductPickerProps) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className={`w-full p-3 border rounded-lg text-base mb-3 ${
          totalStockQuantity < 50 ? 'border-orange-500' : 'border-gray-300'
        }`}
        value={selectedProductId}
        onChange={(e) => onProductSelect(e.target.value)}
      >
        {products.map((product) => {
          let discountText = '';
          if (product.onSale) discountText += ' ⚡SALE';
          if (product.suggestSale) discountText += ' 💝추천';

          let optionText = `${product.name} - ${product.val.toLocaleString()}원`;
          let className = '';

          if (product.q === 0) {
            optionText = `${product.name} - ${product.val.toLocaleString()}원 (품절)${discountText}`;
            className = 'text-gray-400';
          } else {
            if (product.onSale && product.suggestSale) {
              optionText = `⚡💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (25% SUPER SALE!)`;
              className = 'text-purple-600 font-bold';
            } else if (product.onSale) {
              optionText = `⚡${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (20% SALE!)`;
              className = 'text-red-500 font-bold';
            } else if (product.suggestSale) {
              optionText = `💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (5% 추천할인!)`;
              className = 'text-blue-500 font-bold';
            } else {
              optionText = `${product.name} - ${product.val.toLocaleString()}원${discountText}`;
            }
          }
          return (
            <option
              key={product.id}
              value={product.id}
              disabled={product.q === 0}
              className={className}
            >
              {optionText}
            </option>
          );
        })}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>
      {stockInfoMessage && (
        <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
          {stockInfoMessage}
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
