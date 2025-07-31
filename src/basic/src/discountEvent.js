const SUGGEST_SALE_INTERVAL = 60000; // 60초
const LIGHTNING_SALE_INTERVAL = 30000; // 30초

function lightningDelayTimer(second) {
  return Math.random() * second * 1000;
}

export function initializeDiscountEvents({ productList, handleUpdateForDiscountEvents, lastSel }) {
  // 번개세일 이벤트
  function initializeLightningSale() {
    setTimeout(() => {
      setInterval(function () {
        const luckyIdx = Math.floor(Math.random() * productList.length);
        const luckyItem = productList[luckyIdx];
        if (luckyItem.q > 0 && !luckyItem.onSale) {
          luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
          luckyItem.onSale = true;
          alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          handleUpdateForDiscountEvents();
        }
      }, LIGHTNING_SALE_INTERVAL);
    }, lightningDelayTimer(10));
  }

  // 추천 할인 이벤트
  function initializeSuggestSale() {
    setTimeout(function () {
      setInterval(function () {
        if (lastSel) {
          let suggest = null;
          for (let k = 0; k < productList.length; k++) {
            if (productList[k].id !== lastSel) {
              if (productList[k].q > 0) {
                if (!productList[k].suggestSale) {
                  suggest = productList[k];
                  break;
                }
              }
            }
          }
          if (suggest) {
            alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
            suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
            suggest.suggestSale = true;
            handleUpdateForDiscountEvents();
          }
        }
      }, SUGGEST_SALE_INTERVAL);
    }, lightningDelayTimer(20));
  }

  initializeLightningSale();
  initializeSuggestSale();
}
