// 상품 옵션 생성
export function ProductOption(optionData) {
  const opt = document.createElement("option");
  opt.value = optionData.value;
  opt.textContent = optionData.textContent;
  opt.disabled = optionData.disabled;
  opt.className = optionData.className;
  return opt;
}
