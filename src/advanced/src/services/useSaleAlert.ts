import { useEffect, useRef } from 'react';
import { useGlobalState, useGlobalDispatch } from '../providers/useGlobal';
import { getRandomNumber } from '../utils/getRandomNumber';
import { findSuggestedProduct } from '../libs/findSuggestProduct';
import { MESSAGE } from '../constants';

export const useSaleAlert = () => {
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();

  const { productList, appState } = state;

  // 최신 상태를 참조하기 위한 ref
  const productListRef = useRef(productList);
  const appStateRef = useRef(appState);

  useEffect(() => {
    productListRef.current = productList;
  }, [productList]);

  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  useEffect(() => {
    // 번개 세일
    const flashTimeout = setTimeout(() => {
      const flashInterval = setInterval(() => {
        const currentProductList = productListRef.current;
        const luckyIdx = Math.floor(getRandomNumber(currentProductList.length));
        const luckyItem = currentProductList[luckyIdx];

        if (luckyItem && luckyItem.quantity > 0 && !luckyItem.flashSale) {
          dispatch({ type: 'APPLY_FLASH_SALE', productId: luckyItem.id });
          alert(MESSAGE.ALERT.FLASH(luckyItem.name));
        }
      }, 30000);

      return () => clearInterval(flashInterval);
    }, getRandomNumber(10000));

    // 추천 세일
    const suggestTimeout = setTimeout(() => {
      const suggestInterval = setInterval(() => {
        const { lastSelectedProductId } = appStateRef.current;
        const currentProductList = productListRef.current;

        if (!lastSelectedProductId) return;

        const suggestedProduct = findSuggestedProduct(currentProductList, lastSelectedProductId);
        if (suggestedProduct && suggestedProduct.quantity > 0 && !suggestedProduct.suggestSale) {
          dispatch({ type: 'APPLY_SUGGEST_SALE', productId: suggestedProduct.id });
          alert(MESSAGE.ALERT.SUGGEST(suggestedProduct.name));
        }
      }, 60000);

      return () => clearInterval(suggestInterval);
    }, getRandomNumber(20000));

    return () => {
      clearTimeout(flashTimeout);
      clearTimeout(suggestTimeout);
    };
  }, [dispatch]);
};
