import React, { memo, useCallback } from "react";
import { CSS_CLASSES, MESSAGES } from "../../constants";
import { useCart } from "../../hooks/useCart";
import { useProduct } from "../../hooks/useProduct";
import type { Product } from "../../types";

const ProductSelector: React.FC = () => {
  const { products, selectedProduct, selectProduct } = useProduct();
  const { addToCart } = useCart();

  const handleProductSelect = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const productId = event.target.value;
      if (productId) {
        selectProduct(productId);
      }
    },
    [selectProduct],
  );

  const handleAddToCart = useCallback(() => {
    if (selectedProduct) {
      addToCart(selectedProduct.id, 1);
    }
  }, [selectedProduct, addToCart]);

  const getStockStatus = () => {
    // main.original.js와 동일하게 모든 재고 부족/품절 상품 정보 표시
    let infoMsg = "";

    products.forEach((item) => {
      if (item.q < 5) {
        if (item.q > 0) {
          infoMsg += `${item.name}: ${MESSAGES.LOW_STOCK_WARNING} (${item.q}개 남음)\n`;
        } else {
          infoMsg += `${item.name}: ${MESSAGES.OUT_OF_STOCK}\n`;
        }
      }
    });

    return infoMsg;
  };

  const getButtonStyle = () => {
    if (!selectedProduct) return CSS_CLASSES.ADD_BUTTON;

    const product = products.find((p) => p.id === selectedProduct.id);
    if (!product) return CSS_CLASSES.ADD_BUTTON;

    // 품절 상품일 때 빨간색 스타일 적용
    if (product.q === 0) {
      return "w-full py-3 bg-red-600 text-white text-sm font-medium uppercase tracking-wider hover:bg-red-700 transition-all";
    }

    return CSS_CLASSES.ADD_BUTTON;
  };

  const formatProductOption = (product: Product) => {
    let displayText = "";

    if (product.q === 0) {
      displayText = `${product.name} - ${product.val.toLocaleString()}원 (${MESSAGES.OUT_OF_STOCK})`;
    } else {
      if (product.onSale && product.suggestSale) {
        displayText = `⚡💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (25% SUPER SALE!)`;
      } else if (product.onSale) {
        displayText = `⚡${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (20% SALE!)`;
      } else if (product.suggestSale) {
        displayText = `💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (5% 추천할인!)`;
      } else {
        displayText = `${product.name} - ${product.val.toLocaleString()}원`;
      }
    }

    return displayText;
  };

  return (
    <div className={CSS_CLASSES.SELECTOR_CONTAINER}>
      <select
        id="product-select"
        className={CSS_CLASSES.PRODUCT_SELECT}
        value={selectedProduct?.id || ""}
        onChange={handleProductSelect}
        aria-label="상품을 선택하세요"
      >
        <option value="" disabled>
          상품을 선택하세요
        </option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.q === 0}>
            {formatProductOption(product)}
          </option>
        ))}
      </select>

      <button
        id="add-to-cart"
        className={getButtonStyle()}
        onClick={handleAddToCart}
        disabled={!selectedProduct}
      >
        Add to Cart
      </button>

      <div id="stock-status" data-testid="stock-status" className={CSS_CLASSES.STOCK_INFO}>
        {getStockStatus()}
      </div>
    </div>
  );
};

export default memo(ProductSelector);
