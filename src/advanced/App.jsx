import { Header } from "./components/Header";
import { GridContainer } from "./components/GridContainer";
import { LeftColumn } from "./components/LeftColumn";
import { Manual } from "./components/manual/Manual";
import { prodList } from "./data";
import { useState } from "react";
import { useMemo } from "react";
import { RightColumn } from "./components/RightColumn";

function App() {
  const [productList, setProductList] = useState(prodList);
  const [cartItems, setCartItems] = useState([]);

  const isLowStock = useMemo(
    () => productList.reduce((acc, cur) => acc + cur.quantity, 0) < 50,
    [productList]
  );

  // Cart에 상품이 담길 때 쓰일 예정
  setProductList;
  setCartItems;

  return (
    <>
      <Header />
      <GridContainer>
        <LeftColumn isLowStock={isLowStock} productList={productList} />
        <RightColumn productList={productList} cartItems={cartItems} />
      </GridContainer>
      <Manual />
    </>
  );
}

export default App;
