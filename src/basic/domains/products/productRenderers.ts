import { STOCK_THRESHOLDS, DISCOUNT_RULES } from "../../constants";
import { useProductData } from "./productData";

/**
 * 상품 선택 옵션 데이터 계산 (순수 함수)
 * @returns {Object} 상품 선택 옵션 데이터
 */
export function calculateProductSelectData() {
  const products = useProductData.getProducts();

  let totalStock = 0;
  for (let idx = 0; idx < products.length; idx += 1) {
    const product = products[idx];
    totalStock += product.q;
  }

  const optionData = products.map(function (item) {
    let discountText = "";
    if (item.onSale) discountText += " ⚡SALE";
    if (item.suggestSale) discountText += " 💝추천";

    let optionText;
    let optionClass;
    let isDisabled;

    if (item.q === 0) {
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
    options: optionData,
    totalStock,
    shouldShowWarning: totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_WARNING,
  };
}

/**
 * 상품 선택 옵션 엘리먼트들 생성 (순수 함수)
 * @param {Object} selectData - 상품 선택 데이터
 * @returns {Array} option 엘리먼트 배열
 */
export function createProductSelectOptions(selectData: any) {
  return selectData.options.map(function (optionData: any) {
    const opt = document.createElement("option");
    opt.value = optionData.id;
    opt.textContent = optionData.text;
    opt.disabled = optionData.disabled;
    if (optionData.className) {
      opt.className = optionData.className;
    }
    return opt;
  });
}

/**
 * 상품 선택 렌더러 객체
 * DOM 조작만 담당
 */
export const ProductSelectRenderer = {
  /**
   * 상품 선택 옵션 렌더링
   * @param {Object} selectData - 상품 선택 데이터
   */
  render(selectData: any) {
    const productSelectElement = document.getElementById("product-select") as HTMLSelectElement;
    if (!productSelectElement) return;

    productSelectElement.innerHTML = "";

    const options = createProductSelectOptions(selectData);
    options.forEach(function (opt) {
      productSelectElement.appendChild(opt);
    });

    if (selectData.shouldShowWarning) {
      productSelectElement.style.borderColor = "orange";
    } else {
      productSelectElement.style.borderColor = "";
    }
  },
};
