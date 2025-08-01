import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Product } from "../types";

export default function ProductSelector() {
  const { state, addToCart } = useCart();
  const { products } = state;
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  };

  const getPriceText = (product: Product): string => {
    if (product.onSale && product.suggestSale) {
      return `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
    }
    if (product.onSale) {
      return `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
    }
    if (product.suggestSale) {
      return `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
    }
    return `${product.name} - ${product.price}원`;
  };

  const getProductDisplayText = (product: Product): string => {
    const text = getPriceText(product);
    return product.quantity === 0 ? `${text} (품절)` : text;
  };

  const getProductClassName = (product: Product): string => {
    if (product.quantity === 0) {
      return "text-gray-400";
    }

    if (product.onSale && product.suggestSale) {
      return "text-purple-600 font-bold";
    } else if (product.onSale) {
      return "text-red-500 font-bold";
    } else if (product.suggestSale) {
      return "text-blue-500 font-bold";
    }

    return "";
  };

  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const hasLowStock = totalStock < 50;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select value={selectedProduct} onChange={handleProductChange} className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3" style={{ borderColor: hasLowStock ? "orange" : "" }}>
        <option value="">상품을 선택하세요</option>
        {products.map(product => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0} className={getProductClassName(product)}>
            {getProductDisplayText(product)}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddToCart}
        disabled={!selectedProduct}
        className={`w-full py-3 text-white text-sm font-medium uppercase tracking-wider transition-all ${!selectedProduct ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
      >
        Add to Cart
      </button>

      <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {products
          .filter(product => product.quantity < 5)
          .map(product => (product.quantity > 0 ? `${product.name}: 재고 부족 (${product.quantity}개 남음)\n` : `${product.name}: 품절\n`))
          .join("")}
      </div>
    </div>
  );
}
