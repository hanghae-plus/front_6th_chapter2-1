import { Header } from "./components/Header";
import { GridContainer } from "./components/GridContainer";
import { LeftColumn } from "./components/LeftColumn";
import { Manual } from "./components/manual/Manual";
import { prodList } from "./data";
import { useState } from "react";

function App() {
  const [productList, setProductList] = useState(prodList);

  // Cart에 상품이 담길 때 쓰일 예정
  setProductList;

  return (
    <>
      <Header />
      <GridContainer>
        <LeftColumn productList={productList} />
        {/* <RightColumn productList={productList} /> */}
      </GridContainer>
      <Manual />
    </>
  );
}

export default App;
