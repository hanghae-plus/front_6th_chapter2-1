import { useMemo, useCallback, ChangeEvent } from "react";
import type { Product } from "../types";
import { DISCOUNT_RATES, STOCK_THRESHOLDS } from "../constants";

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
    if (product.quantity === STOCK_THRESHOLDS.OUT_OF_STOCK) {
      return `${product.name} - ${product.price}원 (품절)`;
    }

    if (product.isOnLightningSale && product.isSuggestedSale) {
      return `⚡💝${product.name} - ${product.originalPrice}원 → ${
        product.price
      }원 (${Math.round(DISCOUNT_RATES.SUPER_SALE * 100)}% SUPER SALE!)`;
    } else if (product.isOnLightningSale) {
      return `⚡${product.name} - ${product.originalPrice}원 → ${
        product.price
      }원 (${Math.round(DISCOUNT_RATES.LIGHTNING_SALE * 100)}% SALE!)`;
    } else if (product.isSuggestedSale) {
      return `💝${product.name} - ${product.originalPrice}원 → ${
        product.price
      }원 (${Math.round(DISCOUNT_RATES.SUGGEST_SALE * 100)}% 추천할인!)`;
    } else {
      return `${product.name} - ${product.price}원`;
    }
  }, [
    product.name,
    product.price,
    product.originalPrice,
    product.quantity,
    product.isOnLightningSale,
    product.isSuggestedSale,
  ]);

  const optionClassName = useMemo(() => {
    if (product.quantity === STOCK_THRESHOLDS.OUT_OF_STOCK) {
      return "text-gray-400";
    }

    if (product.isOnLightningSale && product.isSuggestedSale) {
      return "text-purple-600 font-bold";
    } else if (product.isOnLightningSale) {
      return "text-red-500 font-bold";
    } else if (product.isSuggestedSale) {
      return "text-blue-500 font-bold";
    }

    return "";
  }, [product.quantity, product.isOnLightningSale, product.isSuggestedSale]);

  return (
    <option
      value={product.id}
      disabled={product.quantity === STOCK_THRESHOLDS.OUT_OF_STOCK}
      className={optionClassName}
    >
      {optionText}
    </option>
  );
}

function StockInfo({ products }: { products: Product[] }) {
  const stockMessage = useMemo(() => {
    const lowStockThreshold = STOCK_THRESHOLDS.LOW_STOCK;

    return products
      .filter((item) => item.quantity < lowStockThreshold)
      .map((item) => {
        item.quantity > STOCK_THRESHOLDS.OUT_OF_STOCK
          ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
          : `${item.name}: 품절`;
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
  stockWarningThreshold = STOCK_THRESHOLDS.WARNING_THRESHOLD,
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
