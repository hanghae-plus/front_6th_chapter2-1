// React 스타일로 리팩토링된 이벤트 리스너들

// 장바구니 이벤트 위임 핸들러 (React 스타일)
function attachCartEventListener(cartContainer, cartHandlers) {
  cartContainer.addEventListener('click', function (event) {
    const { target } = event;

    // 이벤트 위임 패턴
    if (target.classList.contains('quantity-change')) {
      const { productId } = target.dataset;
      const change = parseInt(target.dataset.change);
      cartHandlers.handleQuantityChange(productId, change);
    } else if (target.classList.contains('remove-item')) {
      const { productId } = target.dataset;
      cartHandlers.handleRemoveItem(productId);
    }
  });
}

// 도움말 모달 이벤트 핸들러 (React 스타일)
function attachManualEventListener(
  manualToggle,
  manualOverlay,
  manualHandlers,
) {
  manualToggle.addEventListener('click', manualHandlers.handleToggleManual);
  manualOverlay.addEventListener('click', manualHandlers.handleOverlayClick);
}

// 장바구니 추가 버튼 이벤트 핸들러 (React 스타일)
function attachAddToCartEventListener(addButton, cartHandlers) {
  addButton.addEventListener('click', cartHandlers.handleAddToCart);
}

export {
  attachCartEventListener,
  attachManualEventListener,
  attachAddToCartEventListener,
};
