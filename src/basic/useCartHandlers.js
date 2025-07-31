import {
  validateProductSelection,
  calculateQuantityUpdate,
  processAddToCart,
  toggleManualModal,
} from './cartActions';
import { CartItem } from './components/ui';

// React 커스텀 훅 스타일의 장바구니 핸들러
export function createCartHandlers({
  productList,
  cartContainer,
  selectElement,
  findProductById,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
  setLastSelectedProductId,
}) {
  // 장바구니 추가 핸들러 (순수 함수 + 사이드 이펙트 분리)
  const handleAddToCart = () => {
    const selectedProductId = selectElement.value;

    // 1. 유효성 검사 (순수 함수)
    const validation = validateProductSelection(selectedProductId, productList);
    if (!validation.isValid) {
      if (validation.error !== '상품을 선택해주세요.') {
        alert(validation.error);
      }
      return;
    }

    const { product } = validation;
    const existingCartElement = document.getElementById(product.id);

    // 2. 비즈니스 로직 계산 (순수 함수)
    const result = processAddToCart(product, existingCartElement);

    // 3. UI 업데이트 (사이드 이펙트)
    switch (result.action) {
      case 'INCREMENT_EXISTING': {
        const quantityElem = result.element.querySelector('.quantity-number');
        quantityElem.textContent = result.newQuantity;
        product.availableStock += result.stockChange;
        break;
      }
      case 'ADD_NEW': {
        const newItem = CartItem(result.product);
        cartContainer.appendChild(newItem);
        product.availableStock += result.stockChange;
        break;
      }
      case 'ERROR': {
        alert(result.error);
        return;
      }
    }

    // 4. 상태 업데이트
    handleCalculateCartStuff();
    setLastSelectedProductId(selectedProductId);
  };

  // 장바구니 수량 변경 핸들러
  const handleQuantityChange = (productId, change) => {
    const itemElement = document.getElementById(productId);
    const product = findProductById(productId);
    const quantityElem = itemElement.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElem.textContent);

    // 1. 수량 변경 계산 (순수 함수)
    const result = calculateQuantityUpdate(
      currentQuantity,
      change,
      product.availableStock,
    );

    // 2. UI 업데이트 (사이드 이펙트)
    switch (result.action) {
      case 'UPDATE': {
        quantityElem.textContent = result.newQuantity;
        product.availableStock += result.stockChange;
        break;
      }
      case 'REMOVE': {
        product.availableStock += result.stockChange;
        itemElement.remove();
        break;
      }
      case 'INVALID': {
        alert(result.error);
        return;
      }
    }

    // 3. 상태 업데이트
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  };

  // 장바구니 아이템 삭제 핸들러
  const handleRemoveItem = (productId) => {
    const itemElement = document.getElementById(productId);
    const product = findProductById(productId);
    const quantityElem = itemElement.querySelector('.quantity-number');
    const removeQuantity = parseInt(quantityElem.textContent);

    // 재고 복구 및 UI 업데이트
    product.availableStock += removeQuantity;
    itemElement.remove();

    handleCalculateCartStuff();
    onUpdateSelectOptions();
  };

  return {
    handleAddToCart,
    handleQuantityChange,
    handleRemoveItem,
  };
}

// 도움말 모달 핸들러 (React 스타일)
export function createManualHandlers(manualOverlay, manualColumn) {
  const handleToggleManual = () => {
    const isCurrentlyHidden = manualOverlay.classList.contains('hidden');
    const toggleResult = toggleManualModal(isCurrentlyHidden);

    // UI 업데이트
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  const handleOverlayClick = (event) => {
    if (event.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  return {
    handleToggleManual,
    handleOverlayClick,
  };
}
