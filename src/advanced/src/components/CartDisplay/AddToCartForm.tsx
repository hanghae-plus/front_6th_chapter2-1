import { useRef, useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { getProducts, setProductUpdateCallback, type Product } from '../../services/saleService';

export default function AddToCartForm() {
  const { dispatch } = useCart();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [products, setProducts] = useState<Product[]>(getProducts());

  useEffect(() => {
    setProductUpdateCallback((updatedProducts) => {
      setProducts([...updatedProducts]);
    });
  }, []);

  const handleAddToCart = () => {
    const selected = selectRef.current?.value;
    if (!selected) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: selected,
        quantity: 1,
      },
    });
  };

  const formatProductOption = (product: Product) => {
    const hasDiscount = product.price < product.originalPrice;
    const discountRate = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    if (product.quantity === 0) {
      return `${product.name} - ₩${product.originalPrice.toLocaleString()} (품절)`;
    }
    
    if (hasDiscount) {
      return `${product.saleIcon}${product.name} - ₩${product.originalPrice.toLocaleString()} → ₩${product.price.toLocaleString()} (${discountRate}% SALE!)`;
    }
    
    return `${product.name} - ₩${product.price.toLocaleString()}`;
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        ref={selectRef}
      >
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.quantity === 0}
            className={
              product.quantity === 0
                ? "text-gray-400"
                : product.price < product.originalPrice
                ? "text-red-500 font-bold"
                : ""
            }
          >
            {formatProductOption(product)}
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      {products.some(p => p.quantity === 0) && (
        <div
          id="stock-status"
          className="text-xs text-red-500 mt-3 whitespace-pre-line"
        >
          {products
            .filter(p => p.quantity === 0)
            .map(p => `${p.name}: 품절`)
            .join('\n')}
        </div>
      )}
    </div>
  );
}
