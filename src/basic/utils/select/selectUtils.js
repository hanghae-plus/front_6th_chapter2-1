import { calculateTotalStock } from "./calculateTotalStock";
import { createOption } from "./optionUtils";

const STOCK_CONFIG = {
  LOW_STOCK_THRESHOLD: 50, // 재고 부족 기준
  BORDER_COLOR: "orange", // 경고 색상
};

/**
 * 상품 선택 옵션 업데이트
 * @param {HTMLElement} sel - 상품 선택 요소
 * @param {Array} prodList - 상품 리스트
 */
export const updateSelectOptions = (sel, prodList) => {
  // 현재 선택된 값 저장
  const currentValue = sel.value;

  sel.innerHTML = "";

  // 상품 리스트 순회
  prodList.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;

    // 옵션 데이터 생성
    const optionData = createOption(item);
    option.textContent = optionData.text;
    option.disabled = optionData.disabled || false;
    option.className = optionData.className;

    // 옵션 추가
    sel.appendChild(option);
  });

  // 이전에 선택된 값이 유효한 옵션인지 확인하고 복원
  if (currentValue && prodList.some((item) => item.id === currentValue)) {
    sel.value = currentValue;
  }

  // 총 재고 수량 계산
  const totalStock = calculateTotalStock(prodList);

  // 재고 부족 시 테두리 색상 변경
  sel.style.borderColor =
    totalStock < STOCK_CONFIG.LOW_STOCK_THRESHOLD
      ? STOCK_CONFIG.BORDER_COLOR
      : "";
};
