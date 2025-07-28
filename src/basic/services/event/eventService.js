import { CartItem } from "../../components/CartItem.js";
import {
  calculateAndRenderCart,
  updateSelectOptions,
  updateCartPrices,
} from "../ui/uiService.js";

// 장바구니 추가 처리
export function handleAddToCart(appState, domElements) {
  const selItem = domElements.sel.value;

  // 유효한 상품 선택 확인
  let hasItem = false;
  for (let idx = 0; idx < appState.prodList.length; idx++) {
    if (appState.prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  if (!selItem || !hasItem) {
    return;
  }

  // 선택된 상품 찾기
  let itemToAdd = null;
  for (let j = 0; j < appState.prodList.length; j++) {
    if (appState.prodList[j].id === selItem) {
      itemToAdd = appState.prodList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd["id"]);

    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector(".quantity-number");
      const newQty = parseInt(qtyElem["textContent"]) + 1;

      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      // 새 아이템 추가
      const newItem = CartItem(itemToAdd);
      domElements.cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }

    calculateAndRenderCart(appState, domElements);
    appState.lastSel = selItem;
  }
}

// 장바구니 아이템 조작 처리 (수량 변경, 삭제)
export function handleCartItemAction(event, appState, domElements) {
  const tgt = event.target;

  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);

    // 해당 상품 찾기
    let prod = null;
    for (let prdIdx = 0; prdIdx < appState.prodList.length; prdIdx++) {
      if (appState.prodList[prdIdx].id === prodId) {
        prod = appState.prodList[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains("quantity-change")) {
      // 수량 변경
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector(".quantity-number");
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

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
      // 아이템 제거
      const qtyElem = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }

    calculateAndRenderCart(appState, domElements);
    updateSelectOptions(domElements.sel, appState.prodList);
  }
}

// 도움말 모달 토글 처리
export function handleHelpToggle() {
  const manualOverlay = document.querySelector(".fixed.inset-0");
  const manualColumn = document.querySelector(".fixed.right-0");

  manualOverlay.classList.toggle("hidden");
  manualColumn.classList.toggle("translate-x-full");
}

// 도움말 모달 오버레이 클릭 처리
export function handleHelpOverlayClick(e) {
  const manualOverlay = document.querySelector(".fixed.inset-0");
  const manualColumn = document.querySelector(".fixed.right-0");

  if (e.target === manualOverlay) {
    manualOverlay.classList.add("hidden");
    manualColumn.classList.add("translate-x-full");
  }
}

// 타이머 기반 이벤트 설정
export function setupTimerEvents(appState, domElements) {
  // 번개세일 타이머 설정
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * appState.prodList.length);
      const luckyItem = appState.prodList[luckyIdx];

      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert("⚡번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");

        updateSelectOptions(domElements.sel, appState.prodList);
        updateCartPrices(domElements.cartDisp, appState.prodList);
        calculateAndRenderCart(appState, domElements);
      }
    }, 30000);
  }, lightningDelay);

  // 추천할인 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (domElements.cartDisp.children.length === 0) {
        return;
      }

      if (appState.lastSel) {
        let suggest = null;
        for (let k = 0; k < appState.prodList.length; k++) {
          if (appState.prodList[k].id !== appState.lastSel) {
            if (appState.prodList[k].q > 0) {
              if (!appState.prodList[k].suggestSale) {
                suggest = appState.prodList[k];
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

          updateSelectOptions(domElements.sel, appState.prodList);
          updateCartPrices(domElements.cartDisp, appState.prodList);
          calculateAndRenderCart(appState, domElements);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
