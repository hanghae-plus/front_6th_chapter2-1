import Header from './components/Header';
import Layout from './components/Layout';
import HelpModal from './components/HelpModal';
import { useProductState } from './hooks/useProductState';
import { useCartState } from './hooks/useCartState';
import { useLightningSale } from './hooks/useLightningSale';
import { useCartActions } from './hooks/useCartActions';
import OrderSummary from './components/OrderSummary';
import LeftContent from './components/LeftContent';

function App() {
  const { productList, setProductList } = useProductState();
  const { cartState, setCartState } = useCartState();

  useLightningSale(setProductList);

  const { handleAdd, handleCartClick } = useCartActions({
    productList,
    setProductList,
    cartState,
    setCartState,
  });

  return (
    <>
      <Header itemCount={cartState.cartItems.length} />
      <Layout
        leftContent={
          <LeftContent
            productList={productList}
            lastSelectedProduct={cartState.lastSelectedProduct}
            onAdd={handleAdd}
            onCartClick={handleCartClick}
            cartItems={cartState.cartItems}
          />
        }
        rightContent={
          <OrderSummary cartState={cartState} productList={productList} />
        }
      />
      <HelpModal />
    </>
  );
}

export default App;
