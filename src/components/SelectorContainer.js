// 상품 선택/추가/재고 안내 컴포넌트
// 사용법: SelectorContainer({ products, onAdd, stockText })

export default function SelectorContainer({ products, onAdd, stockText }) {
  // 컨테이너 생성
  const container = document.createElement("div");
  container.className = "mb-6 pb-6 border-b border-gray-200";

  // 상품 선택 셀렉트
  const sel = document.createElement("select");
  sel.id = "product-select";
  sel.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
  // 옵션 추가
  products.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.id;
    let discountText = "";
    if (item.onSale) discountText += " ⚡SALE";
    if (item.suggestSale) discountText += " 💝추천";
    if (item.q === 0) {
      opt.textContent =
        item.name + " - " + item.val + "원 (품절)" + discountText;
      opt.disabled = true;
      opt.className = "text-gray-400";
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent =
          "⚡💝" +
          item.name +
          " - " +
          item.originalVal +
          "원 → " +
          item.val +
          "원 (25% SUPER SALE!)";
        opt.className = "text-purple-600 font-bold";
      } else if (item.onSale) {
        opt.textContent =
          "⚡" +
          item.name +
          " - " +
          item.originalVal +
          "원 → " +
          item.val +
          "원 (20% SALE!)";
        opt.className = "text-red-500 font-bold";
      } else if (item.suggestSale) {
        opt.textContent =
          "💝" +
          item.name +
          " - " +
          item.originalVal +
          "원 → " +
          item.val +
          "원 (5% 추천할인!)";
        opt.className = "text-blue-500 font-bold";
      } else {
        opt.textContent = item.name + " - " + item.val + "원" + discountText;
      }
    }
    container.appendChild(sel);
    sel.appendChild(opt);
  });

  // Add to Cart 버튼
  const addBtn = document.createElement("button");
  addBtn.id = "add-to-cart";
  addBtn.innerHTML = "Add to Cart";
  addBtn.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
  addBtn.addEventListener("click", () => {
    if (typeof onAdd === "function") {
      onAdd(sel.value);
    }
  });

  // 재고 안내
  const stockInfo = document.createElement("div");
  stockInfo.id = "stock-status";
  stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  stockInfo.textContent = stockText || "";

  // 조립
  container.appendChild(sel);
  container.appendChild(addBtn);
  container.appendChild(stockInfo);

  // 외부에서 select, stockInfo에 접근 필요시 반환
  container.getSelect = () => sel;
  container.getStockInfo = () => stockInfo;

  return container;
}
