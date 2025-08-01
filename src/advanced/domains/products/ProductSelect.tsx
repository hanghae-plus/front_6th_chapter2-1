import { useState, useCallback, useMemo } from "react";
import { IProduct } from "../../types";
import { DISCOUNT_RULES } from "../discounts/constants";
import { STOCK_THRESHOLDS } from "../stock/constants";

interface ProductSelectProps {
  products: IProduct[];
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
}

interface ProductOption {
  id: string;
  text: string;
  className: string;
  disabled: boolean;
}

/**
 * Products 도메인 - 상품 선택 컴포넌트
 *
 * 기존 ProductSelectRenderer를 React 컴포넌트로 변환
 * - 상품 선택 드롭다운
 * - 할인 상품 강조 표시
 * - 품절 상품 비활성화
 * - 재고 부족 시 경고 표시
 */
export function ProductSelect({ products, onProductSelect, onAddToCart }: ProductSelectProps) {
  const [selectedProductId, setSelectedProductId] = useState("");

  /**
   * 상품 선택 옵션 데이터 계산 (메모이제이션)
   */
  const productSelectData = useMemo(() => {
    const totalStock = products.reduce((total, product) => total + product.quantity, 0);

    const options: ProductOption[] = products.map((item) => {
      let discountText = "";
      if (item.onSale) discountText += " ⚡SALE";
      if (item.suggestSale) discountText += " 💝추천";

      let optionText: string;
      let optionClass: string;
      let isDisabled: boolean;

      if (item.quantity === 0) {
        optionText = `${item.name} - ${item.val}원 (품절)${discountText}`;
        optionClass = "text-gray-400";
        isDisabled = true;
      } else if (item.onSale && item.suggestSale) {
        const totalDiscountRate = DISCOUNT_RULES.LIGHTNING_SALE_RATE + DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE;
        optionText = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${totalDiscountRate}% SUPER SALE!)`;
        optionClass = "text-purple-600 font-bold";
        isDisabled = false;
      } else if (item.onSale) {
        optionText = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RULES.LIGHTNING_SALE_RATE}% SALE!)`;
        optionClass = "text-red-500 font-bold";
        isDisabled = false;
      } else if (item.suggestSale) {
        optionText = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE}% 추천할인!)`;
        optionClass = "text-blue-500 font-bold";
        isDisabled = false;
      } else {
        optionText = `${item.name} - ${item.val}원${discountText}`;
        optionClass = "";
        isDisabled = false;
      }

      return {
        id: item.id,
        text: optionText,
        className: optionClass,
        disabled: isDisabled,
      };
    });

    return {
      options,
      totalStock,
      shouldShowWarning: totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_WARNING,
    };
  }, [products]);

  /**
   * 상품 선택 핸들러
   */
  const handleProductChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const productId = event.target.value;
      setSelectedProductId(productId);
      onProductSelect(productId);
    },
    [onProductSelect],
  );

  /**
   * 장바구니 추가 핸들러
   */
  const handleAddToCart = useCallback(() => {
    onAddToCart();
  }, [onAddToCart]);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        value={selectedProductId}
        onChange={handleProductChange}
        className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${
          productSelectData.shouldShowWarning ? "border-orange-500" : ""
        }`}
        aria-label="상품 선택"
      >
        <option value="">상품을 선택하세요</option>
        {productSelectData.options.map((option) => (
          <option key={option.id} value={option.id} disabled={option.disabled} className={option.className}>
            {option.text}
          </option>
        ))}
      </select>

      <button
        id="add-to-cart"
        onClick={handleAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        disabled={!selectedProductId}
        aria-label="Add to Cart"
      >
        Add to Cart
      </button>
    </div>
  );
}
