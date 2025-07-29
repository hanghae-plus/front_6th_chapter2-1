import { calculateTotalStock } from "./calculateTotalStock";
import { createOption } from "./optionUtils";

const STOCK_CONFIG = {
  LOW_STOCK_THRESHOLD: 50, // 재고 부족 기준
  BORDER_COLOR: "orange", // 경고 색상
};

export const updateSelectOptions = (sel, prodList) => {
  sel.innerHTML = "";

  const totalStock = calculateTotalStock(prodList);

  prodList.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;

    const optionData = createOption(item);
    option.textContent = optionData.text;
    option.disabled = optionData.disabled || false;
    option.className = optionData.className;

    sel.appendChild(option);
  });

  // 재고 부족 시 테두리 색상 변경
  sel.style.borderColor =
    totalStock < STOCK_CONFIG.LOW_STOCK_THRESHOLD
      ? STOCK_CONFIG.BORDER_COLOR
      : "";
};
