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

let lastSel = null;
let productSelector = ProductSelector();

let addBtn = AddButton({
  onClick: () => handleAddToCart(productSelector.value),
});
let stockInfo = StockInfoText();
let cartItemBox = CartItemBox({ onClick: (e) => handleCartItemClick(e) });

const initRender = () => {
  let root = document.getElementById("app");
  let header = Header();
  let gridContainer = GridContainer();
  let leftColumn = LeftColumn();
  let selectorContainer = SelectorContainer();
  let rightColumn = RightColumn();
  let manualToggle = ManualToggle();
  let manualOverlay = ManualOverlay();
  let manualColumn = ManualColumn();

  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartItemBox);
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

const useFunction = (fn, { onSuccess }) => {
  return () => {
    const result = fn();
    onSuccess(result);
  };
};

const handleCalculateCartStuff = useFunction(
  () => getOrderSummary({ cartItems: [...cartItemBox.children] }),
  {
    onSuccess: (summary) => {
      SummaryDetails(summary);
      CartTotal(summary);
      LoyaltyPoints(summary);

      doRenderBonusPoints(summary);
      DiscountInfo(summary);
      TotalItemCount(summary);
      stockInfo.textContent = getStockInfoMessage();

      summary.cartItems.forEach((item) => {
        const priceTexts = item.querySelectorAll(".text-lg");
        priceTexts.forEach((text) => {
          const quantity = Number(
            item.querySelector(".quantity-number").textContent
          );
          text.style.fontWeight = quantity >= 10 ? "bold" : "normal";
        });
      });

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

      document.getElementById("item-count").textContent =
        `🛍️ ${totalItemCount} items in cart`;
    },
  }
);

const main = () => {
  const { manualToggle, manualOverlay, manualColumn } = initRender();

  let randomBaseDelay = Math.random() * 10000;

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

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  const startFlashSaleWithDelay = (
    delay = randomBaseDelay,
    interval = 30000,
    applyFlashSaleFn
  ) => {
    setTimeout(() => {
      setInterval(applyFlashSaleFn, interval);
    }, delay);
  };

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

  startFlashSaleWithDelay(randomBaseDelay, 30000, applyLuckySaleAlert);
  startFlashSaleWithDelay(randomBaseDelay * 2, 60000, applySuggestSaleAlert);
};

const onUpdateSelectOptions = () => {
  productSelector.innerHTML = "";
  productSelector.append(...prodList.map(ProductOption));

  const totalStock = prodList.reduce((acc, item) => acc + item.quantity, 0);
  productSelector.style.borderColor = totalStock < 50 ? "orange" : "";
};

const getHasItemInCart = (cartItems) => {
  return {
    hasKeyboard: cartItems.some((item) => item.id === PRODUCT_ONE),
    hasMouse: cartItems.some((item) => item.id === PRODUCT_TWO),
    hasMonitorArm: cartItems.some((item) => item.id === PRODUCT_THREE),
  };
};

const getCalculatePoints = ({
  totalItemCount,
  totalDiscountedPrice,
  hasKeyboard,
  hasMouse,
  hasMonitorArm,
}) => {
  const basePoints = Math.floor(totalDiscountedPrice / 1000);

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

const doUpdatePricesInCart = () => {
  let cartItems = [...cartItemBox.children];
  cartItems.forEach((cartItem) => {
    let product = prodList.find((item) => item.id === cartItem.id);
    if (product) {
      const priceDiv = cartItem.querySelector(".text-lg");
      const nameDiv = cartItem.querySelector("h3");
      priceDiv.textContent = "₩" + product.price.toLocaleString();
      nameDiv.textContent = product.name;

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

main();

const handleAddToCart = (selectedId) => {
  const itemToAdd = prodList.find((item) => item.id === selectedId);
  if (!itemToAdd || itemToAdd.quantity === 0) {
    return;
  }

  const item = document.getElementById(itemToAdd["id"]);
  if (!item) {
    const cartItem = CartItem(itemToAdd);
    cartItemBox.appendChild(cartItem);
    itemToAdd.quantity--;

    handleCalculateCartStuff();
    lastSel = itemToAdd.id;
    return;
  }

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

const handleCartItemClick = (event) => {
  const target = event.target;
  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const prodId = target.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }
    if (target.classList.contains("quantity-change")) {
      const qtyChange = parseInt(target.dataset.change);
      const currentQuantityEl = itemElem.querySelector(".quantity-number");
      const currentQty = parseInt(currentQuantityEl.textContent);
      const newQuantity = currentQty + qtyChange;
      if (newQuantity > 0 && newQuantity <= prod.quantity + currentQty) {
        currentQuantityEl.textContent = newQuantity;
        prod.quantity -= qtyChange;
      } else if (newQuantity <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      const currentQuantityEl = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(currentQuantityEl.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
};
