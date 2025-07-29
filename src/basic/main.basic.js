import {
  GridContainer,
  LeftColumn,
  SelectorContainer,
  ProductSelector,
  RightColumn,
  ManualToggle,
  ManualOverlay,
  ManualColumn,
  Header,
  CartItem,
  AddButton,
  StockInfoText,
  CartItemBox,
  ProductOption,
} from "./components";
import { prodList } from "./data";
import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  // PRODUCT_FOUR,
  // PRODUCT_FIVE,
} from "./constants";
import { SummaryDetails } from "./components/SummaryDetails";
import { getOrderSummary } from "./entity/order";
import { CartTotal } from "./components/CartTotal";
import { LoyaltyPoints } from "./components/LoyaltyPoints";
import { DiscountInfo } from "./components/DiscountInfo";
import { TotalItemCount } from "./components/TotalItemCount";
import { getStockInfoMessage } from "./entity/stock";

let lastSel = null;
let productSelector = ProductSelector();
let addBtn = AddButton();
let stockInfo = StockInfoText();
let cartItemBox = CartItemBox();

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
  // TODO: 호출하지 말고 본체를 넘기도록 고치기
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

  setTimeout(() => {
    setInterval(() => {
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
    }, 30000);
  }, randomBaseDelay);
  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        let suggest = prodList.find(
          (item) =>
            item.id !== lastSel && item.quantity > 0 && !item.suggestSale
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
    }, 60000);
  }, randomBaseDelay * 2);
};

const onUpdateSelectOptions = () => {
  productSelector.innerHTML = "";
  productSelector.append(...prodList.map(ProductOption));

  const totalStock = prodList.reduce((acc, item) => acc + item.quantity, 0);
  productSelector.style.borderColor = totalStock < 50 ? "orange" : "";
};

const doRenderBonusPoints = ({
  totalItemCount,
  totalDiscountedPrice,
  cartItems,
}) => {
  let basePoints = Math.floor(totalDiscountedPrice / 1000);
  let finalPoints = 0;
  let pointsDetail = [];
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  if (cartItems.length === 0) {
    return;
  }

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push("화요일 2배");
    }
  }
  for (const cartItem of cartItems) {
    let product = null;
    for (let pIdx = 0; pIdx < prodList.length; pIdx++) {
      if (prodList[pIdx].id === cartItem.id) {
        product = prodList[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_TWO) {
      hasMouse = true;
    } else if (product.id === PRODUCT_THREE) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("풀세트 구매 +100p");
  }
  if (totalItemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else {
    if (totalItemCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push("대량구매(20개+) +50p");
    } else {
      if (totalItemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push("대량구매(10개+) +20p");
      }
    }
  }
  let bonusPts = finalPoints;
  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>
      `;
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};

const doUpdatePricesInCart = () => {
  let cartItems = cartItemBox.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector(".text-lg");
      const nameDiv = cartItems[i].querySelector("h3");
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-purple-600">₩${product.price.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`;
        nameDiv.textContent = "⚡" + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-blue-500">₩${product.price.toLocaleString()}</span>`;
        nameDiv.textContent = "💝" + product.name;
      } else {
        priceDiv.textContent = "₩" + product.price.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
};

main();
addBtn.addEventListener("click", () => {
  const selItem = productSelector.value;
  let hasItem = false;
  for (let idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd["id"]);
    if (item) {
      const qtyElem = item.querySelector(".quantity-number");
      const newQty = parseInt(qtyElem["textContent"]) + 1;
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["quantity"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const cartItem = CartItem(itemToAdd);
      cartItemBox.appendChild(cartItem);
      itemToAdd.quantity--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});
cartItemBox.addEventListener("click", (event) => {
  const tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector(".quantity-number");
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      const qtyElem = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});
