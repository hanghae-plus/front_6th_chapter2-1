import {
  Header,
  GridContainer,
  LeftColumn,
  RightColumn,
  TotalItemCount,
  SelectorContainer,
  ProductSelector,
  AddButton,
  ProductOption,
  StockInfoText,
  CartItem,
  CartItemBox,
  CartTotal,
  ManualToggle,
  ManualOverlay,
  ManualColumn,
  DiscountInfo,
  LoyaltyPoints,
  SummaryDetails,
} from "./components";
import { prodList } from "./data";
import { PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE } from "./constants";
import { getOrderSummary } from "./entity/order";
import { getStockInfoMessage } from "./entity/stock";

// 마지막으로 선택된 상품 ID 저장 (추천 세일에서 사용)
let lastSel = null;

// 각 UI 컴포넌트 인스턴스 생성
let productSelector = ProductSelector();
let addBtn = AddButton({
  onClick: () => handleAddToCart(productSelector.value),
});
let stockInfo = StockInfoText();
let cartItemBox = CartItemBox({ onClick: (e) => handleCartItemClick(e) });

/**
 * 초기 DOM 구성 및 렌더링
 * @returns {Object} – 이후에 필요할 수 있는 몇몇 요소들을 반환
 */
const initRender = () => {
  let root = document.getElementById("app");

  // 상단 헤더 및 레이아웃 컨테이너 생성
  let header = Header();
  let gridContainer = GridContainer();
  let leftColumn = LeftColumn();
  let selectorContainer = SelectorContainer();
  let rightColumn = RightColumn();
  let manualToggle = ManualToggle();
  let manualOverlay = ManualOverlay();
  let manualColumn = ManualColumn();

  // 상품 선택 UI 조합
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartItemBox);

  // 레이아웃에 좌/우 컬럼 및 매뉴얼 추가
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  return {
    rightColumn,
    manualToggle,
    manualOverlay,
    manualColumn,
  };
};

/**
 * 성공 콜백을 받는 래퍼 (간단한 훅 대체)
 * @param {Function} fn – 실행할 함수
 * @param {Object} param1
 * @param {Function} param1.onSuccess – 성공 후 호출될 함수
 * @returns {Function}
 */
const useFunction = (fn, { onSuccess }) => {
  return () => {
    const result = fn();
    onSuccess(result);
  };
};

/**
 * 장바구니 요약을 계산하고 관련 UI 업데이트
 */
const handleCalculateCartStuff = useFunction(
  () => getOrderSummary({ cartItems: [...cartItemBox.children] }),
  {
    onSuccess: (summary) => {
      // 요약 세부정보 UI 반영
      SummaryDetails(summary);
      CartTotal(summary);
      LoyaltyPoints(summary);

      // 보너스 포인트 계산 및 렌더
      doRenderBonusPoints(summary);

      // 할인 정보, 총 개수 등 업데이트
      DiscountInfo(summary);
      TotalItemCount(summary);
      stockInfo.textContent = getStockInfoMessage();

      // 수량 10개 이상인 항목 글자 굵게
      setBoldTextForTenOrMore(summary);

      // 화요일 특가 노출
      displayTuesdaySpecial(summary);

      // item-count 영역 텍스트 반영
      displayTotalItemCount(summary);
    },
  }
);

/**
 * 앱 초기 진입점
 */
const main = () => {
  const { manualToggle, manualOverlay, manualColumn } = initRender();

  // 매뉴얼 토글 동작 설정
  manualToggle.onclick = () => {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };
  manualOverlay.onclick = (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };

  // 셀렉트 옵션 초기화 및 장바구니 요약 렌더
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 랜덤 지연을 주고 주기적으로 세일/추천 알림 실행
  let randomBaseDelay = Math.random() * 10000;
  const useIntervalEffect = (delay = randomBaseDelay, interval = 30000, Fn) => {
    setTimeout(() => {
      setInterval(Fn, interval);
    }, delay);
  };

  // 번개세일: 무작위 상품에 20% 할인 적용
  const applyLuckySaleAlert = () => {
    const luckyIdx = Math.floor(Math.random() * prodList.length);
    const luckyItem = prodList[luckyIdx];

    if (luckyItem.quantity > 0 && !luckyItem.onSale) {
      luckyItem.price = Math.round((luckyItem.originalPrice * 80) / 100);
      luckyItem.onSale = true;
      alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      onUpdateSelectOptions();
      doUpdatePricesInCart();
      handleCalculateCartStuff();
    }
  };

  // 추천세일: 마지막 선택과 다른 상품을 추천
  const applySuggestSaleAlert = () => {
    if (lastSel) {
      let suggest = prodList.find(
        (item) => item.id !== lastSel && item.quantity > 0 && !item.suggestSale
      );
      if (suggest) {
        alert(
          `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
        );
        suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
        suggest.suggestSale = true;
        onUpdateSelectOptions();
        doUpdatePricesInCart();
        handleCalculateCartStuff();
      }
    }
  };

  useIntervalEffect(randomBaseDelay, 30000, applyLuckySaleAlert);
  useIntervalEffect(randomBaseDelay * 2, 60000, applySuggestSaleAlert);
};

/**
 * 셀렉트 옵션(상품 리스트) 다시 렌더 + 총 재고에 따라 스타일 변경
 */
const onUpdateSelectOptions = () => {
  productSelector.innerHTML = "";
  productSelector.append(...prodList.map(ProductOption));

  const totalStock = prodList.reduce((acc, item) => acc + item.quantity, 0);
  productSelector.style.borderColor = totalStock < 50 ? "orange" : "";
};

/**
 * 장바구니에 특정 세트가 있는지 여부 계산
 */
const getHasItemInCart = (cartItems) => {
  return {
    hasKeyboard: cartItems.some((item) => item.id === PRODUCT_ONE),
    hasMouse: cartItems.some((item) => item.id === PRODUCT_TWO),
    hasMonitorArm: cartItems.some((item) => item.id === PRODUCT_THREE),
  };
};

/**
 * 포인트 계산 로직: 기본, 세트, 대량 구매, 화요일 등
 */
const getCalculatePoints = ({
  totalItemCount,
  totalDiscountedPrice,
  hasKeyboard,
  hasMouse,
  hasMonitorArm,
}) => {
  const basePoints = Math.floor(totalDiscountedPrice / 1000);

  // 적용 가능한 이벤트들 정의
  const saleEvents = [
    {
      condition: () => basePoints > 0,
      calcSalePoint: () => basePoints,
      message: `기본: ${basePoints}p`,
    },
    {
      condition: () => new Date().getDay() === 2 && basePoints > 0,
      calcSalePoint: () => basePoints * 2,
      message: "화요일 2배",
    },
    {
      condition: () => hasKeyboard && hasMouse,
      calcSalePoint: (points) => points + 50,
      message: "키보드+마우스 세트 +50p",
    },
    {
      condition: () => hasKeyboard && hasMouse && hasMonitorArm,
      calcSalePoint: (points) => points + 100,
      message: "풀세트 구매 +100p",
    },
    {
      condition: () => totalItemCount >= 30,
      calcSalePoint: (points) => points + 100,
      message: "대량구매(30개+) +100p",
    },
    {
      condition: () => totalItemCount >= 20 && totalItemCount < 30,
      calcSalePoint: (points) => points + 50,
      message: "대량구매(20개+) +50p",
    },
    {
      condition: () => totalItemCount >= 10 && totalItemCount < 20,
      calcSalePoint: (points) => points + 20,
      message: "대량구매(10개+) +20p",
    },
  ];

  let finalPoints = 0;
  const pointsDetail = [];
  saleEvents.forEach(({ calcSalePoint, condition, message }) => {
    if (condition()) {
      finalPoints = calcSalePoint(finalPoints);
      pointsDetail.push(message);
    }
  });

  return {
    basePoints,
    finalPoints,
    pointsDetail,
  };
};

/**
 * 보너스 포인트 렌더링 (장바구니가 비어있지 않을 때만)
 */
const doRenderBonusPoints = ({
  totalItemCount,
  totalDiscountedPrice,
  cartItems,
}) => {
  if (cartItems.length === 0) {
    return;
  }

  const { hasKeyboard, hasMouse, hasMonitorArm } = getHasItemInCart(cartItems);

  const { finalPoints, pointsDetail } = getCalculatePoints({
    totalItemCount,
    totalDiscountedPrice,
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
  });

  LoyaltyPoints({
    totalDiscountedPrice,
    cartItems,
    bonusPoints: finalPoints,
    pointsDetail,
  });
};

/**
 * 장바구니 내 상품 정보를 기반으로 가격/이름 업데이트
 */
const doUpdatePricesInCart = () => {
  let cartItems = [...cartItemBox.children];
  cartItems.forEach((cartItem) => {
    let product = prodList.find((item) => item.id === cartItem.id);
    if (product) {
      const priceDiv = cartItem.querySelector(".text-lg");
      const nameDiv = cartItem.querySelector("h3");
      priceDiv.textContent = "₩" + product.price.toLocaleString();
      nameDiv.textContent = product.name;

      // 세일/추천 표기 로직
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-purple-600">₩${product.price.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      }
      if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`;
        nameDiv.textContent = "⚡" + product.name;
      }
      if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-blue-500">₩${product.price.toLocaleString()}</span>`;
        nameDiv.textContent = "💝" + product.name;
      }
    }
  });
};

/**
 * 수량이 10개 이상인 항목 가격 텍스트를 굵게 처리
 */
const setBoldTextForTenOrMore = (summary) => {
  summary.cartItems.forEach((item) => {
    const priceTexts = item.querySelectorAll(".text-lg");
    priceTexts.forEach((text) => {
      const quantity = Number(
        item.querySelector(".quantity-number").textContent
      );
      text.style.fontWeight = quantity >= 10 ? "bold" : "normal";
    });
  });
};

/**
 * 화요일 특가 UI 토글
 */
const displayTuesdaySpecial = (summary) => {
  const { isTuesday, totalDiscountedPrice, totalItemCount } = summary;
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday) {
    if (totalDiscountedPrice > 0) {
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
};

/**
 * 장바구니 총 개수 텍스트 업데이트
 */
const displayTotalItemCount = (summary) => {
  const { totalItemCount } = summary;
  document.getElementById("item-count").textContent =
    `🛍️ ${totalItemCount} items in cart`;
};

// 앱 시작
main();

/**
 * 장바구니에 상품 추가 처리
 * @param {string} selectedId – 선택된 상품 ID
 */
const handleAddToCart = (selectedId) => {
  const itemToAdd = prodList.find((item) => item.id === selectedId);
  if (!itemToAdd || itemToAdd.quantity === 0) {
    return; // 없는 상품이거나 품절이면 무시
  }

  // 이미 DOM에 존재하는지 확인
  const item = document.getElementById(itemToAdd["id"]);
  if (!item) {
    // 새로 추가
    const cartItem = CartItem(itemToAdd);
    cartItemBox.appendChild(cartItem);
    itemToAdd.quantity--;

    handleCalculateCartStuff();
    lastSel = itemToAdd.id;
    return;
  }

  // 기존 아이템 수량 증가
  const currentQuantityEl = item.querySelector(".quantity-number");
  const currentQuantity = parseInt(currentQuantityEl.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity > itemToAdd.quantity + currentQuantity) {
    alert("재고가 부족합니다.");
  }

  currentQuantityEl.textContent = newQuantity;
  itemToAdd.quantity--;

  handleCalculateCartStuff();
  lastSel = itemToAdd.id;
};

/**
 * 장바구니 아이템 클릭 (수량 조절 / 제거) 처리
 */
const handleCartItemClick = (event) => {
  const target = event.target;
  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const currentProductId = target.dataset.productId;
    const currentCartItem = document.getElementById(currentProductId);
    const currentProduct = prodList.find(
      (item) => item.id === currentProductId
    );
    const currentQuantityEl = currentCartItem.querySelector(".quantity-number");
    const currentQuantity = parseInt(currentQuantityEl.textContent);

    if (target.classList.contains("quantity-change")) {
      const offset = parseInt(target.dataset.change);
      const newQuantity = currentQuantity + offset;

      const availableStock = currentProduct.quantity + currentQuantity;

      // 수량이 0 이하이면 제거
      if (newQuantity <= 0) {
        currentProduct.quantity += currentQuantity;
        currentCartItem.remove();
        return;
      }

      // 재고 초과 방지
      if (newQuantity > availableStock) {
        alert("재고가 부족합니다.");
        return;
      }

      // 정상적인 수량 변경
      currentQuantityEl.textContent = String(newQuantity);
      currentProduct.quantity -= offset;
    } else if (target.classList.contains("remove-item")) {
      // 완전 제거: 현재 수량을 재고로 복구
      currentProduct.quantity += currentQuantity;
      currentCartItem.remove();
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions(); // 셀렉트 옵션 (재고 기반) 다시 갱신
  }
};
