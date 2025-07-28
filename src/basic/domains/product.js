import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
} from "../constants/index.js";

// 전체 재고 수량 계산
export function calculateStockTotal(products) {
  return products.reduce((sum, product) => sum + product.q, 0);
}

// 개별 상품 할인율 계산 (10개 이상 구매 시)
export function calculateItemDiscount(productId, quantity) {
  if (quantity < 10) return 0;

  const discountMap = {
    [PRODUCT_ONE]: 0.1,
    [PRODUCT_TWO]: 0.15,
    [PRODUCT_THREE]: 0.2,
    [PRODUCT_FOUR]: 0.05,
    [PRODUCT_FIVE]: 0.25,
  };

  return discountMap[productId] || 0;
}

// 재고 부족 상품 메시지 생성
export function generateStockStatusMessage(products) {
  return products
    .filter((item) => item.q < 5)
    .map((item) =>
      item.q > 0
        ? `${item.name}: 재고 부족 (${item.q}개 남음)`
        : `${item.name}: 품절`
    )
    .join("\n");
}

// 상품 선택 옵션 데이터 생성
export function generateSelectOptionsData(products) {
  const totalStock = calculateStockTotal(products);
  const options = products.map((item) => {
    let discountText = "";
    if (item.onSale) discountText += " ⚡SALE";
    if (item.suggestSale) discountText += " 💝추천";

    const optionData = {
      value: item.id,
      disabled: item.q === 0,
      className: item.q === 0 ? "text-gray-400" : "",
    };

    if (item.q === 0) {
      optionData.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
    } else {
      if (item.onSale && item.suggestSale) {
        optionData.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
        optionData.className = "text-purple-600 font-bold";
      } else if (item.onSale) {
        optionData.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
        optionData.className = "text-red-500 font-bold";
      } else if (item.suggestSale) {
        optionData.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
        optionData.className = "text-blue-500 font-bold";
      } else {
        optionData.textContent = `${item.name} - ${item.val}원${discountText}`;
      }
    }

    return optionData;
  });

  return { options, totalStock };
}

// 상품 데이터 초기화
export function initializeProductData() {
  return [
    {
      id: PRODUCT_ONE,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_TWO,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_THREE,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FOUR,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FIVE,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
}
