interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

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
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        value={selectedProduct}
        onChange={(e) => onProductSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - ₩{product.price.toLocaleString()} (재고:{" "}
            {product.stock}개)
          </option>
        ))}
      </select>

      <button
        onClick={onAddToCart}
        disabled={!selectedProduct}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>

      {stockStatus && (
        <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
          {stockStatus}
        </div>
      )}
    </div>
  );
};
