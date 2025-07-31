// ================================================
// UI 이벤트 핸들러
// ================================================

/**
 * 매뉴얼 토글 버튼 클릭 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleManualToggle(event, context) {
  const { stateActions } = context;
  stateActions.toggleManualOverlay();
}

/**
 * 매뉴얼 오버레이 배경 클릭 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleManualOverlayClick(event, context) {
  const { stateActions } = context;

  // 오버레이 자체를 클릭했을 때만 닫기
  if (event.target.classList.contains('fixed')) {
    stateActions.toggleManualOverlay();
  }
}

/**
 * 상품 선택 변경 이벤트 핸들러
 * @param {Event} event - change 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleProductSelectChange(event, context) {
  const { onUpdateSelectOptions } = context;
  onUpdateSelectOptions();
}

/**
 * 상품 옵션 업데이트 함수
 * @param {Object} context - 컨텍스트 객체
 */
export function updateProductOptions(context) {
  const { sel, productList, ProductOption } = context;

  sel.innerHTML = '';
  productList.forEach((item) => {
    sel.innerHTML += ProductOption({ item });
  });
}
