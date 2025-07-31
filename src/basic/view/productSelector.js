import { createProductSelectorOption } from './elements';
import { globalElements } from './globalElements';

export const renderProductSelect = ({ options, isLowTotalStock }) => {
  if (!globalElements.productSelector)
    throw Error(
      '[UI 요소 누락] globalElements의 productSelector가 초기화되지 않았습니다. renderLayout() 이후에 호출해주세요.'
    );

  globalElements.productSelector.innerHTML = '';

  options.forEach((option) => {
    const newOptionElment = createProductSelectorOption({ ...option, value: option.id });
    globalElements.productSelector.appendChild(newOptionElment);
  });

  globalElements.productSelector.style.borderColor = isLowTotalStock ? 'orange' : '';
};
