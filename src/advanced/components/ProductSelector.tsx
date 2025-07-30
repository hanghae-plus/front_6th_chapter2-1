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
      setSelectedProduct("");
    }
  };

  const getProductDisplayText = (product: Product): string => {
    let text = product.name;

    if (product.onSale && product.suggestSale) {
      text = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
    } else if (product.onSale) {
      text = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
    } else if (product.suggestSale) {
      text = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
    } else {
      text = `${product.name} - ${product.val}원`;
    }

    if (product.q === 0) {
      text += " (품절)";
    }

    return text;
  };

  const getProductClassName = (product: Product): string => {
    if (product.q === 0) {
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

  const totalStock = products.reduce((sum, product) => sum + product.q, 0);
  const hasLowStock = totalStock < 50;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select value={selectedProduct} onChange={handleProductChange} className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${hasLowStock ? "border-orange-500" : ""}`}>
        <option value="">상품을 선택하세요</option>
        {products.map(product => (
          <option key={product.id} value={product.id} disabled={product.q === 0} className={getProductClassName(product)}>
            {getProductDisplayText(product)}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddToCart}
        disabled={!selectedProduct}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>

      <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {products
          .filter(product => product.q < 5)
          .map(product => (product.q > 0 ? `${product.name}: 재고 부족 (${product.q}개 남음)\n` : `${product.name}: 품절\n`))
          .join("")}
      </div>
    </div>
  );
}
