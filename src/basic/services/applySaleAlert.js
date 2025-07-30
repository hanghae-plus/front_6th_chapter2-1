import { getRandomNumber } from "../utils/getRandomNumber";
import { applyFlashSale, applySuggestSale } from "../html/states/productState";
import { renderProductOptionList } from "../html/render/renderProductOptionList";
import { updateCartStatus } from "../main.basic";

export const applySaleAlert = ({ state, appState }) => {
  // 세일 추천 alert 함수
  // 첫번째 - 번개 세일
  setTimeout(() => {
    setInterval(() => {
      // 랜덤 상품 선택
      const luckyIdx = Math.floor(getRandomNumber(state.productState.length));
      const luckyItem = state.productState[luckyIdx];

      // 상품이 재고가 있고 세일 중이 아님
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // 20프로 할인 적용 후 상태를 할인 중으로 업데이트
        applyFlashSale(state, luckyItem.id);
        // alert 실행
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        // 셀렉트 옵션 및 장바구니 상태 업데이트
        renderProductOptionList(state);
        updateCartStatus({ state, appState });
      }
      // 30초마다 시도
    }, 30000);
  }, getRandomNumber(10000)); // 초기 지연

  // 두번째 - 추천 세일
  setTimeout(() => {
    setInterval(() => {
      // 마지막에 장바구니에 담은 상품이 있으면 실행
      if (appState.lastSelectedProductId) {
        const suggestedProduct = findSuggestedProduct(state.productState, appState.lastSelectedProductId);

        // 조건에 맞는 상품이 존재
        if (suggestedProduct) {
          // 5프로 할인 적용 후 상태를 추천 중으로 업데이트
          applySuggestSale(state, suggestedProduct.id);

          // alert 실행
          alert('💝 ' + suggestedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');

          // 셀렉트 옵션 및 장바구니 상태 업데이트
          renderProductOptionList(state);
          updateCartStatus({ state, appState });
        }
      }
      // 60초마다 시도
    }, 60000);
  }, getRandomNumber(20000)); // 초기 지연 1 ~ 20초
};
