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
import { CartItem, Product } from "./model/types";
import { getStockInfoMessage } from "./services/stock";

function App() {
  const [lastSelectedItem, setLastSelectedItem] = useState<Product | null>(
    null
  );

  const [productList, setProductList] = useState(prodList);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  const addToCart = (selected: Product) => {
    const newCartItems = [...cartItems];
    const selectedCartItem = newCartItems.find((x) => x.id === selected.id);
    if (selectedCartItem == null) {
      newCartItems.push({ ...selected, selectedQuantity: 1 });
    } else {
      selectedCartItem.selectedQuantity++;
    }
    setCartItems([...newCartItems]);
    setLastSelectedItem(selected);

    const newProductList = [...productList];
    const selectedIndex = newProductList.findIndex((x) => x.id === selected.id);
    newProductList[selectedIndex].quantity -= 1;
    setProductList([...newProductList]);
  };

  const removeFromCart = ({
    id,
    selectedQuantity,
  }: {
    id: string;
    selectedQuantity: number;
  }) => {
    const newCartItems = [...cartItems].filter((x) => x.id !== id);
    setCartItems([...newCartItems]);

    const newProductList = [...productList];
    const selectedIndex = newProductList.findIndex((x) => x.id === id);
    newProductList[selectedIndex].quantity += selectedQuantity;
    setProductList([...newProductList]);
  };

  const changeCartItemQuantity = ({
    id,
    change,
  }: {
    id: string;
    change: number;
  }) => {
    const newCartItems = [...cartItems];
    const selectedCartItem = newCartItems.find((x) => x.id === id);
    const newProductList = [...productList];
    const selectedIndex = newProductList.findIndex((x) => x.id === id);

    if (selectedCartItem == null) {
      return;
    }

    if (selectedCartItem.selectedQuantity + change < 0) {
      return;
    }

    if (newProductList[selectedIndex].quantity - change < 0) {
      alert("재고가 부족합니다.");
      return;
    }

    if (selectedCartItem.selectedQuantity + change === 0) {
      setCartItems(newCartItems.filter((x) => x.id !== id));
    } else {
      selectedCartItem.selectedQuantity += change;
      setCartItems([...newCartItems]);
    }

    newProductList[selectedIndex].quantity -= change;
    setProductList([...newProductList]);
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
            bottom={
              <StockInfoText>{getStockInfoMessage(productList)}</StockInfoText>
            }
          />
          <CartItemBox
            cartItems={cartItems}
            productList={productList}
            onClickRemove={removeFromCart}
            increaseCartItemQuantity={({ id }) =>
              changeCartItemQuantity({ id, change: 1 })
            }
            decreaseCartItemQuantity={({ id }) =>
              changeCartItemQuantity({ id, change: -1 })
            }
          />
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
