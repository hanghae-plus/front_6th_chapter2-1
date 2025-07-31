import { useMemo, useCallback, ChangeEvent } from "react";
import type { Product } from "../types";

type ProductSelectorProps = {
  products: Product[];
  selectedProductId: string;
  stockWarningThreshold?: number;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
};

type ProductOptionProps = {
  product: Product;
};

function ProductOption({ product }: ProductOptionProps) {
  const optionText = useMemo(() => {
    if (product.quantity === 0) {
      return `${product.name} - ${product.value}원 (품절)`;
    }

    if (product.onSale && product.suggestSale) {
      return `⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)`;
    } else if (product.onSale) {
      return `⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)`;
    } else if (product.suggestSale) {
      return `💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)`;
    } else {
      return `${product.name} - ${product.value}원`;
    }
  }, [
    product.name,
    product.value,
    product.originalValue,
    product.quantity,
    product.onSale,
    product.suggestSale,
  ]);

  const optionClassName = useMemo(() => {
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
  }, [product.quantity, product.onSale, product.suggestSale]);

  return (
    <option
      value={product.id}
      disabled={product.quantity === 0}
      className={optionClassName}
    >
      {optionText}
    </option>
  );
}

function StockInfo({ products }: { products: Product[] }) {
  const stockMessage = useMemo(() => {
    const lowStockThreshold = 5; // QUANTITY_THRESHOLDS.LOW_STOCK

    return products
      .filter((item) => item.quantity < lowStockThreshold)
      .map((item) => {
        if (item.quantity > 0) {
          return `${item.name}: 재고 부족 (${item.quantity}개 남음)`;
        } else {
          return `${item.name}: 품절`;
        }
      })
      .join("\n");
  }, [products]);

  if (!stockMessage) return null;

  return (
    <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
      {stockMessage}
    </div>
  );
}

export function ProductSelector({
  products,
  selectedProductId,
  stockWarningThreshold = 10,
  onProductSelect,
  onAddToCart,
}: ProductSelectorProps) {
  const totalStock = useMemo(
    () => products.reduce((total, product) => total + product.quantity, 0),
    [products]
  );

  const isLowStock = useMemo(
    () => totalStock < stockWarningThreshold,
    [totalStock, stockWarningThreshold]
  );

  const handleProductSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onProductSelect(e.target.value);
    },
    [onProductSelect]
  );

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        value={selectedProductId}
        onChange={handleProductSelect}
        className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${
          isLowStock ? "border-orange-500" : ""
        }`}
      >
        {products.map((product) => (
          <ProductOption key={product.id} product={product} />
        ))}
      </select>

      <button
        onClick={onAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>

      <StockInfo products={products} />
    </div>
  );
}
