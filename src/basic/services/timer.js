import { TIMER_INTERVAL } from '../constants/constants';

function lightningTimer(
  productList,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
) {
  const lightningDelay = Math.random() * 10000;

  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.availableStock > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_INTERVAL.LIGHTNING);
  }, lightningDelay);
}

function recommendTimer(
  productList,
  lastSelectedProductId,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
) {
  const recommendDelay = Math.random() * 20000;

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProductId) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelectedProductId) {
            if (productList[k].availableStock > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_INTERVAL.RECOMMEND);
  }, recommendDelay);
}
export { lightningTimer, recommendTimer };
