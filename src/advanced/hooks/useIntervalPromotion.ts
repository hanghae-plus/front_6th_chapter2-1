import { useIntervalEffect } from "../utils/hooks";
import { getLuckySaleProduct, getSuggestSaleProduct } from "../services/event";
import { Product } from "../model/types";

interface Props {
  productList: Product[];
  setProductList: (productList: Product[]) => void;
  lastSelectedItem: Product | null;
}

export const useIntervalPromotion = ({
  productList,
  setProductList,
  lastSelectedItem,
}: Props) => {
  const randomBaseDelay = Math.random() * 10000;

  const luckySaleEvent = () => {
    const {
      luckyProduct,
      productList: newProductList,
      alreadyLucky,
    } = getLuckySaleProduct(productList);

    setProductList(newProductList);

    if (!alreadyLucky) {
      alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
    }
  };

  const suggestSaleEvent = () => {
    const suggestSaleProduct = getSuggestSaleProduct(
      productList,
      lastSelectedItem
    );

    if (suggestSaleProduct == null) {
      return;
    }

    setProductList(suggestSaleProduct.productList);
    alert(
      `💝 ${suggestSaleProduct.suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
    );
  };

  useIntervalEffect(
    luckySaleEvent,
    {
      interval: 30000,
      delay: randomBaseDelay,
    },
    [productList]
  );

  useIntervalEffect(
    suggestSaleEvent,
    {
      interval: 60000,
      delay: randomBaseDelay * 2,
    },
    [productList, lastSelectedItem]
  );
};
