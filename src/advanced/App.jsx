import { Header } from "./components/Header";
import { GridContainer } from "./components/GridContainer";
import { LeftColumn } from "./components/LeftColumn";
import { Manual } from "./components/manual/Manual";
import { prodList } from "./data";
import { useState } from "react";
import { useMemo } from "react";
import { RightColumn } from "./components/RightColumn";
import { useOrderSummary } from "./services/order";
import { SelectorContainer } from "./components/selector/SelectorContainer";
import { CartItemBox } from "./components/CartItemBox";
import { StockInfoText } from "./components/selector/StockInfoText";
import { useIntervalPromotion } from "./hooks/useIntervalPromotion";
import { useEffect } from "react";

// TODO: 추후 분리 예정
const getStockInfoMessage = (productList) => {
  return productList.reduce((acc, item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        acc += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        acc += `${item.name}: 품절\n`;
      }
    }
    return acc;
  }, "");
};

function App() {
  const [lastSelectedItem, setLastSelectedItem] = useState(null);

  const [productList, setProductList] = useState(prodList);
  const [cartItems, setCartItems] = useState([]);
  const {
    itemDiscounts,
    totalItemCount,
    totalDiscountRate,
    totalOriginalPrice,
    totalDiscountedPrice,
  } = useOrderSummary(cartItems);

  const isLowStock = useMemo(
    () => productList.reduce((acc, cur) => acc + cur.quantity, 0) < 50,
    [productList]
  );

  // Cart에 상품이 담길 때 쓰일 예정
  const addToCart = (selected) => {
    setCartItems((prev) => {
      const selectedIndex = prev.findIndex((x) => x.id === selected.id);
      if (selectedIndex !== -1) {
        prev[selectedIndex].selectedQuantity++;
        return [...prev];
      }

      return [...prev, selected];
    });

    setProductList((prevProductList) => {
      const selectedIndex = prevProductList.findIndex(
        (x) => x.id === selected.id
      );
      prevProductList[selectedIndex].quantity--;

      return [...prevProductList];
    });
  };

  useIntervalPromotion({
    productList,
    setProductList,
    lastSelectedItem,
  });

  return (
    <>
      <Header totalItemCount={totalItemCount} />
      <GridContainer>
        <LeftColumn>
          <SelectorContainer
            cartItems={cartItems}
            addToCart={addToCart}
            productList={productList}
            isLowStock={isLowStock}
            setLastSelectedItem={setLastSelectedItem}
            bottom={
              <StockInfoText>{getStockInfoMessage(productList)}</StockInfoText>
            }
          />
          <CartItemBox cartItems={cartItems} />
        </LeftColumn>
        <RightColumn
          productList={productList}
          cartItems={cartItems}
          itemDiscounts={itemDiscounts}
          totalItemCount={totalItemCount}
          totalDiscountRate={totalDiscountRate}
          totalOriginalPrice={totalOriginalPrice}
          totalDiscountedPrice={totalDiscountedPrice}
        />
      </GridContainer>
      <Manual />
    </>
  );
}

export default App;
