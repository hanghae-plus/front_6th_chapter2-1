import { AddButton } from "../components/AddButton";
import { CartDisplay } from "../components/CartDisplay";
import { GridContainer } from "../components/GridContainer";
import { Header } from "../components/Header";
import { LeftColumn } from "../components/LeftColumn";
import { ManualColumn } from "../components/ManualColumn";
import { ManualOverlay } from "../components/ManualOverlay";
import { ManualToggle } from "../components/ManualToggle";
import { ProductSelector } from "../components/ProductSelector";
import { RightColumn } from "../components/RightColumn";
import { SelectContainer } from "../components/SelectContainer";
import { StockInfo } from "../components/StockInfo";

const PRODUCT_IDS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5",
};
const state = {
  prodList: [],
  bonusPoint: 0,
  itemCount: 0,
  totalAmount: 0,
  lastSel: null,
};

const stockInfo = StockInfo();
const sel = ProductSelector();
const addBtn = AddButton();
let cartDisplay = CartDisplay();

function main() {
  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();
  const selectorContainer = SelectContainer();
  const rightColumn = RightColumn();
  const manualToggle = ManualToggle();
  const manualOverlay = ManualOverlay();
  const manualColumn = ManualColumn();
  const header = Header();
  let lightningDelay;
  state.prodList.push(
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.LAPTOP_POUCH,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    }
  );
  const root = document.getElementById("app");

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  sum = rightColumn.querySelector("#cart-total");

  // 모든 요소가 DOM에 추가된 후 이벤트 설정
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 이벤트 핸들러 설정 (요소 참조 직접 전달)
  manualToggle.addEventListener("click", () =>
    handleManualToggle(manualOverlay, manualColumn)
  );
  manualOverlay.addEventListener("click", (e) =>
    handleManualOverlayClick(e, manualColumn)
  );

  let initStock = 0;
  for (let i = 0; i < state.prodList.length; i++) {
    initStock += state.prodList[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      let luckyIdx = Math.floor(Math.random() * state.prodList.length);
      let luckyItem = state.prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert("⚡번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisplay.children.length === 0) {
      }
      if (state.lastSel) {
        let suggest = null;
        for (let k = 0; k < state.prodList.length; k++) {
          if (state.prodList[k].id !== state.lastSel) {
            if (state.prodList[k].q > 0) {
              if (!state.prodList[k].suggestSale) {
                suggest = state.prodList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            "💝 " +
              suggest.name +
              "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
let sum;

function onUpdateSelectOptions() {
  let totalStock;
  let opt;
  let discountText;
  sel.innerHTML = "";
  totalStock = 0;
  for (let idx = 0; idx < state.prodList.length; idx++) {
    let _p = state.prodList[idx];
    totalStock = totalStock + _p.q;
  }
  for (let i = 0; i < state.prodList.length; i++) {
    (function () {
      let item = state.prodList[i];
      opt = document.createElement("option");
      opt.value = item.id;
      discountText = "";
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
      sel.appendChild(opt);
    })();
  }
  if (totalStock < 50) {
    sel.style.borderColor = "orange";
  } else {
    sel.style.borderColor = "";
  }
}

function handleCalculateCartStuff() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  let originalTotal;
  let bulkDisc;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;
  state.totalAmount = 0;
  state.itemCount = 0;
  originalTotal = state.totalAmount;
  cartItems = cartDisplay.children;
  subTot = 0;
  bulkDisc = subTot;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < state.prodList.length; idx++) {
    if (state.prodList[idx].q < 5 && state.prodList[idx].q > 0) {
      lowStockItems.push(state.prodList[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < state.prodList.length; j++) {
        if (state.prodList[j].id === cartItems[i].id) {
          curItem = state.prodList[j];
          break;
        }
      }
      let qtyElem = cartItems[i].querySelector(".quantity-number");
      let q;
      let itemTot;
      let disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      state.itemCount += q;
      subTot += itemTot;
      let itemDiv = cartItems[i];
      let priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(function (elem) {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = q >= 10 ? "bold" : "normal";
        }
      });
      if (q >= 10) {
        if (curItem.id === PRODUCT_IDS.KEYBOARD) {
          disc = 10 / 100;
        } else {
          if (curItem.id === PRODUCT_IDS.MOUSE) {
            disc = 15 / 100;
          } else {
            if (curItem.id === PRODUCT_IDS.MONITOR_ARM) {
              disc = 20 / 100;
            } else {
              if (curItem.id === PRODUCT_IDS.LAPTOP_POUCH) {
                disc = 5 / 100;
              } else {
                if (curItem.id === PRODUCT_IDS.SPEAKER) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      state.totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  originalTotal = subTot;
  if (state.itemCount >= 30) {
    state.totalAmount = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - state.totalAmount) / subTot;
  }
  const today = new Date();
  let isTuesday = today.getDay() === 2;
  let tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday) {
    if (state.totalAmount > 0) {
      state.totalAmount = (state.totalAmount * 90) / 100;
      discRate = 1 - state.totalAmount / originalTotal;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
  document.getElementById("item-count").textContent =
    "🛍️ " + state.itemCount + " items in cart";
  summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < state.prodList.length; j++) {
        if (state.prodList[j].id === cartItems[i].id) {
          curItem = state.prodList[j];
          break;
        }
      }
      let qtyElem = cartItems[i].querySelector(".quantity-number");
      let q = parseInt(qtyElem.textContent);
      let itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;
    if (state.itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (state.totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  totalDiv = sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(state.totalAmount).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(state.totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = "적립 포인트: " + points + "p";
      loyaltyPointsDiv.style.display = "block";
    } else {
      loyaltyPointsDiv.textContent = "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }
  discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (discRate > 0 && state.totalAmount > 0) {
    savedAmount = originalTotal - state.totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(
            discRate * 100
          ).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = "🛍️ " + state.itemCount + " items in cart";
    if (previousCount !== state.itemCount) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
  stockMsg = "";
  for (let stockIdx = 0; stockIdx < state.prodList.length; stockIdx++) {
    let item = state.prodList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg =
          stockMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        stockMsg = stockMsg + item.name + ": 품절\n";
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

let doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;
  if (cartDisplay.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }
  basePoints = Math.floor(state.totalAmount / 1000);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push("화요일 2배");
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisplay.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < state.prodList.length; pIdx++) {
      if (state.prodList[pIdx].id === node.id) {
        product = state.prodList[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
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
  if (state.itemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else {
    if (state.itemCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push("대량구매(20개+) +50p");
    } else {
      if (state.itemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push("대량구매(10개+) +20p");
      }
    }
  }
  state.bonusPoint = finalPoints;
  let ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (state.bonusPoint > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        state.bonusPoint +
        "p</span></div>" +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(", ") +
        "</div>";
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};

function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < state.prodList.length; i++) {
    currentProduct = state.prodList[i];
    sum += currentProduct.q;
  }
  return sum;
}
let handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  let messageOptimizer;
  infoMsg = "";
  totalStock = onGetStockTotal();
  if (totalStock < 30) {
  }
  state.prodList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        infoMsg = infoMsg + item.name + ": 품절\n";
      }
    }
  });
  stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;
  while (cartDisplay.children[j]) {
    let qty = cartDisplay.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(
      cartDisplay.children[j].querySelector(".quantity-number").textContent
    );
  }
  cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    let itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < state.prodList.length; productIdx++) {
      if (state.prodList[productIdx].id === itemId) {
        product = state.prodList[productIdx];
        break;
      }
    }
    if (product) {
      let priceDiv = cartItems[i].querySelector(".text-lg");
      let nameDiv = cartItems[i].querySelector("h3");
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          "</span>";
        nameDiv.textContent = "⚡💝" + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          "</span>";
        nameDiv.textContent = "⚡" + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          "</span>";
        nameDiv.textContent = "💝" + product.name;
      } else {
        priceDiv.textContent = "₩" + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}

function handleManualToggle(manualOverlay, manualColumn) {
  if (manualOverlay && manualColumn) {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  }
}

function handleManualOverlayClick(e, manualColumn) {
  if (e.target === e.currentTarget && manualColumn) {
    e.currentTarget.classList.add("hidden");
    manualColumn.classList.add("translate-x-full");
  }
}

function handleAddToCart() {
  let selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < state.prodList.length; idx++) {
    if (state.prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < state.prodList.length; j++) {
    if (state.prodList[j].id === selItem) {
      itemToAdd = state.prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd["id"]);
    if (item) {
      let qtyElem = item.querySelector(".quantity-number");
      let newQty = parseInt(qtyElem["textContent"]) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      let newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className =
        "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${
            itemToAdd.onSale && itemToAdd.suggestSale
              ? "⚡💝"
              : itemToAdd.onSale
              ? "⚡"
              : itemToAdd.suggestSale
              ? "💝"
              : ""
          }${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${
            itemToAdd.onSale || itemToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                itemToAdd.originalVal.toLocaleString() +
                '</span> <span class="' +
                (itemToAdd.onSale && itemToAdd.suggestSale
                  ? "text-purple-600"
                  : itemToAdd.onSale
                  ? "text-red-500"
                  : "text-blue-500") +
                '">₩' +
                itemToAdd.val.toLocaleString() +
                "</span>"
              : "₩" + itemToAdd.val.toLocaleString()
          }</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
              itemToAdd.id
            }" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
              itemToAdd.id
            }" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${
            itemToAdd.onSale || itemToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                itemToAdd.originalVal.toLocaleString() +
                '</span> <span class="' +
                (itemToAdd.onSale && itemToAdd.suggestSale
                  ? "text-purple-600"
                  : itemToAdd.onSale
                  ? "text-red-500"
                  : "text-blue-500") +
                '">₩' +
                itemToAdd.val.toLocaleString() +
                "</span>"
              : "₩" + itemToAdd.val.toLocaleString()
          }</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
            itemToAdd.id
          }">Remove</a>
        </div>
      `;
      cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    state.lastSel = selItem;
  }
}

function handleCartDispClick(event) {
  let tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < state.prodList.length; prdIdx++) {
      if (state.prodList[prdIdx].id === prodId) {
        prod = state.prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      let qtyChange = parseInt(tgt.dataset.change);
      let qtyElem = itemElem.querySelector(".quantity-number");
      let currentQty = parseInt(qtyElem.textContent);
      let newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      let qtyElem = itemElem.querySelector(".quantity-number");
      let remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}

main();
addBtn.addEventListener("click", handleAddToCart);
cartDisplay.addEventListener("click", handleCartDispClick);
