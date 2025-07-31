import { getTotalStock } from '../libs/getTotalStock';
import { createProductOption } from '../components/ProductOption';

export const renderProductOptionList = (state) => {
  const { productState } = state;

  const totalStock = getTotalStock(productState);

  const container = document.getElementById('product-select');
  container.innerHTML = ''; // 기존 초기화

  productState.forEach((product) => {
    const optionItem = createProductOption(product);
    container.appendChild(optionItem);
  });

  // 재고 수에 따른 셀렉터 스타일 업데이트
  if (totalStock < 50) {
    container.style.borderColor = 'orange';
  } else {
    container.style.borderColor = '';
  }
};
