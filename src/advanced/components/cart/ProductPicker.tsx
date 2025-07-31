import { useState } from 'react';
import { PRODUCTS } from '../../lib/product';
import { useCart } from '../../contexts/CartContext';

const ProductPicker = () => {
  const { products, addToCart, selectedProductId, setSelectedProduct } = useCart();
  const [selectedProduct, setSelectedProductLocal] = useState<string>('');

  const handleProductSelect = (productId: string) => {
    setSelectedProductLocal(productId);
    setSelectedProduct(productId);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log('ProductPicker: handleAddToCart called with', selectedProduct);
      addToCart(selectedProduct);
    }
  };

  const getStockStatus = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return '';
    return product.stock === 0 ? `${product.name}: 품절` : '';
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProduct}
        onChange={(e) => handleProductSelect(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {PRODUCTS.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price.toLocaleString()}원
          </option>
        ))}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={!selectedProduct}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {selectedProduct && getStockStatus(selectedProduct)}
      </div>
    </div>
  );
};

export default ProductPicker;
